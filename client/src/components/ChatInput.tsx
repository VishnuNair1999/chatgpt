"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import axios from "axios";

type Props = {
  chatId: string;
};

const ChatInput = ({ chatId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const [response, setResponse] = useState("");

  
  const model = "gpt-3.5-turbo";

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    const input = prompt.trim();
    setPrompt("");
    
    // Store user message in Firebase
    const userMessage: Message = {
        text: input,
        createdAt: serverTimestamp(),
        user: {
            _id: session?.user?.email!,
            name: session?.user?.name!,
            avatar: session?.user?.image! || `https://ui-avatars.com/app/?name=${session?.user?.name}`,
        },
    };

    try {
        await addDoc(
            collection(
                db,
                "users",
                session?.user?.email!,
                "chats",
                chatId,
                "messages"
            ),
            userMessage
        );
    } catch (error) {
        console.error("Error storing user message in Firebase:", error);
        return;
    }

    // Toast notification when prompt is passed
    const notification = toast.loading("ChatGPT is thinking...");

    try {
        // Call the OpenAI API directly with the response data from Axios
        const res = await axios.post("http://localhost:3001/chat", {
            prompt: input,
            chatId,
            model,
            session,
           
        });

        const responseData = res.data;

        // Store AI response in Firebase under the same chatId
        const aiMessage: Message = {
            text: responseData,
            createdAt: serverTimestamp(),
            user: {
                _id: "ChatGPT",
                name: "ChatGPT",
                avatar: "https://links.papareact.com/89k",
            },
        };

        await addDoc(
            collection(
                db,
                "users",
                session?.user?.email!,
                "chats",
                chatId,
                "messages"
            ),
            aiMessage
        );

        // Set response state
        setResponse(responseData);

        // Toast Notification when response initialized
        toast.success("ChatGPT has responded!", {
            id: notification,
        });
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        
        toast.error("Failed to fetch response from ChatGPT");
    }
};


  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          disabled={!prompt || !session}
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
        </button>
      </form>
     
    </div>
  );
};

export default ChatInput;
