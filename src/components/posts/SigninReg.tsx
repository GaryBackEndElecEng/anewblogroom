// " use client";
import Link from 'next/link';
import React from 'react'
import Button from "@component/comp/Button";
import { GeneralContext } from "@context/GeneralContextProvider";
import { useSession, signIn, signOut } from "next-auth/react";
import { userAccountType } from '@/lib/Types';

type mainPopType = {
    setSignup: React.Dispatch<React.SetStateAction<boolean>>,
    signup: boolean
}
export default function SigninReg({ getAccount }: { getAccount: userAccountType }) {
    const { loaded, data } = getAccount;

    const popup = " flex flex-col items-center justify-center w-full"

    return (
        <div className={popup}>

            {

                (data && data?.status !== "authenticated") &&
                <React.Fragment>
                    <h3 className="text-center text-xl my-4"> Register or sign in to write a post</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 place-items-center w-full ">
                        <Link href={"/register"}>
                            <button className={"button cursor-pointer rounded-full"} >
                                register
                            </button>
                        </Link>
                        <Link href={"/api/auth/signin"}>
                            <button className={"button cursor-pointer rounded-full"} >
                                sign in
                            </button>
                        </Link>

                    </div>
                </React.Fragment>

            }
        </div>
    )
}
