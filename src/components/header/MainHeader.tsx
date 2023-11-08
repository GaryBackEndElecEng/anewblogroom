
import React from 'react'
import SubHeader from "./SubHeader";
import { getAccount } from "@lib/nextAuth";

export default async function MainHeader() {
    const account = await getAccount();
    return (
        <>
            <SubHeader account={account} />
        </>

    )
}
