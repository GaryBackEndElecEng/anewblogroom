"use client";
import React from 'react'
import { fileType, postType, userAccountType, userType } from '@/lib/Types';
import { GeneralContext } from '../context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import styles from './posts.module.css'
import PostForm from "./PostForm";
import MakeAPostItem from "./MakeAPostItem";
import { InputContext } from '../context/InputTypeProvider';


type mainAccType = {
    getAccount: userAccountType | undefined,
    getuser: userType | null,
    getposts: postType[] | undefined,


}
export default function MakeAPost({ getAccount, getuser, getposts }: mainAccType) {
    const pathname = usePathname();
    const { setPageHit, setAccount, account, setPosts, posts, setUser, user, setPost, post, setMsg, msg, userPosts, setUserPosts } = React.useContext(GeneralContext);
    const { setUserFiles, userFiles } = React.useContext(InputContext);


    React.useEffect(() => {
        if (!getposts || !getuser) return
        setPosts(getposts);
        setUserPosts(getuser.posts);
        setUserFiles(getuser.files)
    }, [getposts, getuser, setUserPosts, setPosts, setUserFiles]);

    React.useEffect(() => {
        if (!getAccount || !getuser) return
        setAccount(getAccount);
        setUser(getuser);
    }, [getAccount, setAccount, setUser, getuser]);

    React.useEffect(() => {
        if (!pathname || !getAccount || !getAccount.data) return
        setPageHit({ page: pathname, name: getAccount?.data?.name });
    }, [pathname, setPageHit, getAccount]);

    React.useEffect(() => {
        if (posts && user) {
            const userTempPosts = posts.filter(post => post.userId === user.id);
            setUserPosts(userTempPosts);
        }
    }, [posts, setUserPosts, user]);


    // console.log(userPosts)


    return (
        <div className="lg:container mx-auto px-1 sm:px-0 my-2">
            <div className="flex flex-col items-center justify-center gap-1 py-1 mx-auto w-full ">
                <PostForm
                />
            </div>
            <div className="flex flex-col items-center justify-center mt-3"><h3 className="text-center text-5xl">Users Posts</h3>
                <div className={` ${styles.divider} h-[5px] w-3/4 bg-slate-200 my-4`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-3 p-1 mx-auto my-2">
                {userPosts && userPosts.map((post, index) => (
                    <React.Fragment key={index}>
                        <MakeAPostItem post={post} user={user && user} />
                    </React.Fragment>
                ))
                }
            </div>

        </div>
    )
}
