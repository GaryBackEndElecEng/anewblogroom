import { useRouter } from 'next/navigation';
import React from 'react'
import { GeneralContext } from "@context/GeneralContextProvider";
import { signIn, } from "next-auth/react";

type mainPopType = {
    setSignup: React.Dispatch<React.SetStateAction<boolean>>,
    signup: boolean
}
export default function PopUp({ signup, setSignup }: mainPopType) {
    const router = useRouter();
    const { account } = React.useContext(GeneralContext);

    const handleRoute = (e: React.MouseEvent) => {

    }
    const popup = signup ? "absolute inset-0 flex flex-col w-full sm:w-3/4 h-[20vh] bg-white/20" : "hidden"

    return (
        <div className={popup}>
            {
                (account && account?.data?.status !== "authenticated") &&
                <div className="flex flex-row justify-evenly align-middle">
                    <button className={"button cursor-pointer"} onClick={() => {
                        setSignup(false)
                        router.push("/register")
                    }}>
                        register
                    </button>
                    <button className={"button cursor-pointer"} onClick={() => { setSignup(false); signIn() }}>
                        sign up
                    </button>
                </div>
            }
        </div>
    )
}
