"use client";
import React from 'react';
import { getAllFiles, getPosts } from "@lib/fetchTypes";
import { msgType, type fetchAllType, fileType, userType, postType } from "@lib/Types";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileItem from "./FileItem";
import { InputContext } from "@context/InputTypeProvider";
import Button from '../comp/Button';
import { GeneralContext } from '../context/GeneralContextProvider';
import styles from "./allblogs.module.css";
import { getUsers } from "@lib/fetchTypes";
import Msg from "@component/blog/Msg";

type fetchType = {
    data: { id: string, filename: string }[],
    message: string
} | {
    data: string[],
    message: string
}
type slugType = [
    { jsonid: string },
    { filename: string }
]

type UserBlogType = {
    get_users: userType[] | undefined,
    getfiles: fileType[] | [],
}


export default function AllBlogs({ get_users, getfiles }: UserBlogType) {
    const { allFiles, setAllFiles } = React.useContext(InputContext);
    const { setPageHit, setUsers, users, setGetError } = React.useContext(GeneralContext);
    const [msg, setMsg] = React.useState<msgType>({} as msgType);
    const [tempFiles, setTempFiles] = React.useState<fileType[]>([])

    React.useMemo(async () => {
        if (get_users) {
            setUsers(get_users);
            setMsg({ loaded: true, msg: "loaded" });
        } else {
            setMsg({ loaded: false, msg: "no users" });
            setGetError("did not get users@ blogs/=>AllBlogs")
        }
    }, [setUsers, get_users, setGetError]);



    React.useEffect(() => {
        setPageHit({ page: "/blog", name: "none" });
        if (window.scrollY) {
            window.scroll(0, 0)
        }
    }, [setPageHit]);

    React.useMemo(async () => {
        setAllFiles(getfiles);
    }, [getfiles, setAllFiles]);

    const container = "allBlog_container mx-auto lg:container flex flex-col p-2 mt-5 gap-3  w-full items-center relative"
    const linkContainer = "allBlog_subContainer flex flex-col gap-1 p-1 justify-start items-center w-full grid-cols-1 sm:grid sm:grid-cols-2 sm:place-items-center sm:gap-2 overflow-hidden "

    return (
        <React.Fragment>
            <div className={container}>
                <div className="absolute mx-auto top-10 inset-0 h-[20vh]">
                    <Msg msg={msg} setMsg={setMsg} />
                </div>
                <div className="flex justify-center items-center">
                    <blockquote className={`learningIsLiving allBlogs_mainText text-xl sm:text-4xl text-white text-center mx-auto italic mb-3  `}>
                        <q>learnng is living</q>
                    </blockquote>
                </div>

                <section className={linkContainer}>
                    {allFiles ? (
                        allFiles.map((item, index) => {
                            if (item.published) {
                                return (
                                    <React.Fragment key={index}>
                                        <FileItem file={item} index={index} users={users} />
                                    </React.Fragment>
                                )
                            }
                        }
                        )
                    ) : (<h4 className="button text-white">{msg.msg}</h4>)}
                </section>
                <Link href="/">
                    <Button color={"emerald"} border={true}>home</Button>
                </Link>
            </div>
        </React.Fragment>
    )
}
