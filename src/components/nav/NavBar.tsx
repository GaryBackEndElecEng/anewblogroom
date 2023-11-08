"use client";
import Link from 'next/link'
import React from 'react'
import Login from "@component/comp/Login";
import GBImage from "./GBImage";
import MediaLinks from "@nav/MediaLinks";


export default function NavBar() {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (window && window.innerWidth < 420) {
            setIsMobile(true);
        }

    }
        , []);
    const nav = "bg-slate-700 py-2 mx-auto  sticky top-0 drop-shadow-xl z-10 max-h-[7vh] w-full "
    const media = "flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-xl lg:text-2xl"
    const mediaContainer = "flex flex-row justify-between sm:justify-evenly items-center gap-4 text-white text-xl lg:text-2xl lg:grid lg:grid-cols-3"
    return (
        <nav className={nav}>
            <div className={mediaContainer}>
                <h3 className=" font-bold text-white grid place-content-center  md:mb-0 ">
                    <Link href={"/"} className="text-white/90 no-underline hover:text-white">
                        <GBImage />
                    </Link>
                </h3>
                <MediaLinks />
                {isMobile ?
                    <details className="bg-black relative">
                        <summary className="text-xs font-bold">signin?</summary>
                        <div className="absolute inset-0 right-7 top-10 w-inherit pb-2">
                            <Login />
                        </div>
                    </details>
                    :
                    <Login />}

            </div>
        </nav>
    )
}
