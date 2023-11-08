
import Home from "@component/home/Home"
import React from "react";
import { getAccount } from "@lib/nextAuth";
//<Home account={account} />



export default async function page() {
  const isAccount = await getAccount() ? await getAccount() : undefined
  const account = isAccount ? isAccount : undefined;
  return (
    <h1> this is the page{JSON.stringify(account)}</h1>
  )
}

