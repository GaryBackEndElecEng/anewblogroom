"use client";
import React from 'react';
import type { fileType, userType } from "@lib/Types";
import Image from 'next/image';
import { GeneralContext } from '@context/GeneralContextProvider';
import { Heading, Section, Summary, SubHeading, Conclusion } from "@component/blogElements/elements";
import { getUsernamePage, getuserFiles } from "@lib/fetchTypes";
import getFormattedDate from "@lib/getFormattedDate";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { InputContext } from '@/components/context/InputTypeProvider';
import ClientFile from "@component/blog/users/ClientFile";

type usernameType = {
    username: string

}
export default function UserNameBlogs({ username }: usernameType) {
    const pathname = usePathname();
    const { client, setClient, setPageHit, setGetError } = React.useContext(GeneralContext);
    const { setUserFiles, userFiles } = React.useContext(InputContext);
    const [numFiles, setNumFiles] = React.useState<number>(1);
    console.log("inside", username)
    React.useMemo(async () => {
        const getuser = await getUsernamePage(username);
        if (!getuser) { return setGetError("no user @usernameBlogs") }
        setClient(getuser as userType)
    }, [username, setClient, setGetError]);

    React.useEffect(() => {
        if (!client) return
        setUserFiles(client.files)
    }, [setUserFiles, setClient, client])



    React.useEffect(() => {
        //pathname=>/blog/usershomelinks/Bob%20Brown
        if (pathname && client) {
            setPageHit({ name: client.name, page: pathname })
        }
    }, [client, setPageHit, pathname]);


    const link = "/blog/usershomelinks/"
    const flexcol = "flex flex-col mx-auto w-full px-3 my-2";
    const title = "text-center font-bold text-4xl";
    const title1 = "text-center font-bold text-3xl";
    return (
        <main className="mx-auto lg:container my-2 px-3 mb-3">
            <h3 className={title}>{client && client.name}</h3>
            <h3 className="text-center font-bold text-xl">Welcome</h3>
            <section className=" mx-auto my-2 mb-6 w-full sm:w-7/8 lg:w-3/4 mx-auto px-3">
                <p className="my-1 sm:px-3 text-xl sm:leading-10">{client && client.bio}</p>
            </section>

            <h3 className="text-center text-[white]  underline underline-offset-8 text-2xl my-3 mb-[3vh]">blogs</h3>

            <section className={`grid grid-cols-1 mx-auto my-2 gap-4 mx-auto px-3`}>
                {userFiles && userFiles.map((file, index) => {
                    if (file.published) return (
                        <React.Fragment key={index}>
                            <ClientFile file={file} client={client} />
                        </React.Fragment>
                    )
                })}
            </section>
        </main>
    )
}
