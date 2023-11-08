
import Home from "@component/home/Home"
import React from "react";
import { getAccount } from "@lib/nextAuth";




export default async function page() {
  const isAccount = await getAccount() ? await getAccount() : undefined
  const account = isAccount ? isAccount : undefined;
  return (
    <Home account={account} />
  )
}

