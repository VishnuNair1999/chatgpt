import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios'; // Import Axios
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;
  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt!" });
    return;
  }
  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  try {
    // Call the OpenAI API using Axios
    const response = await axios.post("http://localhost:3001/chat", {
      prompt: prompt,
      chatId: chatId,
      model: model
    });

    const responseData = response.data;

    const message: Message = {
      text: responseData || "ChatGPT was unable to find an answer for that !",
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "ChatGPT",
        name: "ChatGPT",
        avatar: "https://links.papareact.com/89k",
      },
    };

    // Store the message in Firebase
    await adminDb
      .collection("users")
      .doc(session?.user?.email)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(message);

    res.status(200).json({ answer: message.text });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ answer: "Error calling OpenAI API" });
  }
}
