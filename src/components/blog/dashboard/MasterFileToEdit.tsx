"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { fileType, userAccountType, userType } from '@/lib/Types';
import { GeneralContext } from '@/components/context/GeneralContextProvider';
import DashBoardFileEdit from "@/components/blog/dashboard/DashBoardFileEdit";

type mainInputType = {
    file: fileType,
    get_user: userType | null,
    get_account: userAccountType
}
//NOTE GET_USER HAS ALL FILES AND POSTS TO THE USERNAME
export default function InsertInputContext({ file, get_user, get_account }: mainInputType) {
    const { setUser, setAccount, setUserPosts } = React.useContext(GeneralContext);
    const { setUserFiles } = React.useContext(InputContext);

    React.useEffect(() => {
        if (!get_user) return
        setUser(get_user);
        setAccount(get_account);
    }, [setUser, get_user, get_account, setAccount]);

    React.useEffect(() => {
        if (!get_user) return;
        setUserFiles(get_user.files);
        setUserPosts(get_user.posts);
    }, [get_user, setUserPosts, setUserFiles]);

    return (
        <DashBoardFileEdit recfile={file} />
    )
}
