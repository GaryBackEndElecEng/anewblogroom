
import Home from "@component/home/Home"
import React from "react";
import { getAccount } from "@lib/nextAuth";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";



export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <Home session={session} />
  )
}

