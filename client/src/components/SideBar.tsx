"use client";

import React from "react";
import NewChat from "./NewChat";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import ChatRow from "./ChatRow";

const SideBar = () => {
  const { data: session } = useSession();
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div>
          <NewChat />
          <div> {/* model selection */} </div>
          {/* Map through the ChatRows */}
          {chats?.docs.map((chat) => (
            <ChatRow key={chat.id} id={chat.id} />
          ))}
        </div>
      </div>

      {session && (
        <button
          className="flex items-center justify-center rounded-lg h-12 px-4 bg-green-500 text-black border border-green-600 focus:outline-none"
          onClick={() => signOut()}
        >
          <img
            className="h-8 w-8 rounded-full mr-2"
            src={session.user?.image!}
            alt="Profile Picture"
          />
          <span className="font-bold">Sign Out</span>
        </button>
      )}
    </div>
  );
};

export default SideBar;
