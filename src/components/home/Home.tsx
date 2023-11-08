"use client"
import React from "react";
import MainLinks from "@component/home/MainLinks";
import { GeneralContext } from '@/components/context/GeneralContextProvider';
import { userAccountType } from "@/lib/Types";
import GetError from "@component/comp/GetError";
import { Session } from "next-auth";
// import SubHeader from "@component/header/SubHeader";


export default function Home({ session }: { session: Session | null }) {

    const { setPageHit } = React.useContext(GeneralContext);

    React.useEffect(() => {
        if (window.scrollY) {
            window.scroll(0, 0)
        }
        setPageHit({ page: "/home", name: "none" })
    }, [setPageHit]);




    return (
        <main className="flex min-h-[50vh] flex-col items-center justify-center  " >
            <GetError />
            <MainLinks session={session} />
        </main>
    )
}
