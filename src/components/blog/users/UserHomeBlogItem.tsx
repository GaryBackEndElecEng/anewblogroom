"use client"
import React from 'react';
import { Heading, Section, Summary, SubHeading, Conclusion, ImageJsx, Question, HLink, ListComp, FileContent } from "@blogElement/elements";
import type { fileType, msgType, userType, userTypeShort } from "@lib/Types";
import { inputArr } from "@lib/Types";
import Button from '../../comp/Button';
import Link from 'next/link';
import getFormattedDate from "@lib/getFormattedDate";
import Image from 'next/image';
// import { InputContext } from '../context/InputTypeProvider';
import { GeneralContext } from '../../context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import UserSignatureBlock from "../UserSignatureBlock";
import BlogLike from "@component/blog/BlogLike";
import FileRate from "@component/blog/FileRate";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { InputContext } from '@/components/context/InputTypeProvider';

const url = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_site : "http://localhost:3000"

type mainBlogItemType = {
    file_: fileType | undefined
}
//////////NOTE!! THIS IS FROM blog/usershomelinks/username/file_ID/////////

export default function UserHomeBlogItem({ file_ }: mainBlogItemType) {
    const pathname = usePathname();
    const { setPageHit, setUser, user } = React.useContext(GeneralContext);
    const { setFile } = React.useContext(InputContext);
    const [msg, setMsg] = React.useState<msgType>({} as msgType);
    const noUserUrl = "/blog/usershomelinks"
    const [retUrl, setRetUrl] = React.useState<string>(noUserUrl);

    React.useEffect(() => {
        const getfile_ = async () => {
            if ((file_)) {
                setFile(file_)
            };
        }
        getfile_();
    }, [file_, setFile,]);

    React.useEffect(() => {
        const get_user = async () => {
            if (file_) {
                const user = await getUser(file_.userId);
                if (user) {
                    setUser(user)
                }
            }
        }
        get_user();
    }, [file_, setUser]);


    React.useEffect(() => {
        if (!(user && user.name)) return
        if (!pathname) return
        let username = user.name.replace(" ", "-");
        let url = `/blog/usershomelinks/${username}`
        setRetUrl(url);
        setPageHit({ name: username, page: pathname })
    }, [setPageHit, user, pathname]);


    const container = "w-full lg:container mx-auto";
    const msg_ = "absolute top-[5%] inset-y-0 w-full lg:w-1/4 h-[10vh] flex flex-col justify-center items-center";
    const msgFalse = "text-center text-red-800 font-bold prose prose-xl text-xl m-auto";
    const msgTrue = "text-center text-white prose prose-xl font-bold text-xl m-auto";

    const dateToStr = file_ && file_.date && getFormattedDate(file_.date);

    return (
        <div className={container}>
            <div className="flex flex-col justify-start items-center relative">
                <div className={msg_}>
                    {msg.loaded ? (
                        <div className={msgTrue}>{msg.msg}</div>
                    ) : (<div className={msgFalse}>{msg.msg}</div>)}
                </div>
                <div className={"leading-10 flex flex-row flex-wrap gap mt-0 mb-10"}>
                    <h6 className="font-bold text-slate-200">{user && user.name}, </h6>
                    <small className="font-bold text-slate-300">{dateToStr && JSON.stringify(dateToStr)}</small>
                </div>

            </div>
            <div className="mx-auto lg:container px-2 my-2 flex flex-col items-center">
                {file_ && <FileContent file={file_} />}
            </div>
            <div className="mx-auto lg:container">
                {file_ && file_.inputTypes?.length!! &&
                    file_.inputTypes.map((input, index) => {
                        const check = inputArr.find(name => (name === input.name)) ? true : false;
                        if (!(check)) return
                        return (
                            <React.Fragment key={index}>
                                <Heading input={input} />
                                <SubHeading input={input} />
                                <ImageJsx input={input} />
                                <Summary input={input} />
                                <Section input={input} />
                                <Conclusion input={input} />
                                <Question input={input} />
                                <HLink input={input} />
                                <ListComp input={input} />
                            </React.Fragment>
                        )
                    })
                }
            </div>
            <h3 className="text-orange-100 text-3xl mt-[5vh] underline underline-offset- text-center">Rate Me !</h3>
            <div className="text-xl text-center mb-[5vh]  underline underline-offset-8 text-slate-300 flex flex-row flex-wrap justify-center items-center">

                <q className="italic">
                    rating helps us find what you want</q>
                <BsHandThumbsUpFill style={{ color: "gold", marginLeft: 2 }} />
            </div>
            <div className="flex flex-col justify-center items-center prose prose-md px-3 mx-auto ">
                {file_ && <BlogLike file={file_} />}
            </div>
            <div className="flex flex-col justify-center items-center prose prose-md px-3 mx-auto ">
                {file_ && <FileRate file={file_} />}
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                {file_ && <UserSignatureBlock file={file_} user={user} />}
            </div>
            <div className="flex flex-col justify-center items-center w-full">

                <Link href={retUrl}>
                    <Button color={"emerald"} border={true} >return </Button>
                </Link>
            </div>
        </div>
    )
}

export async function getUser(userId: string): Promise<userType | undefined> {
    const res = await fetch(`${url}/api/getuser?userId=${userId}`);
    if (res.ok) {
        const body: userType = await res.json()
        return body
    }
}