"use client"
import axios from "axios";
import React from 'react';
import type { userAccountType, msgType, userType, mainPageHit, contactType, postType, ratepostType, ratefileType, likepostType, likefileType, genInfoType } from "@lib/Types";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type generalContextType = {
    setAccount: React.Dispatch<React.SetStateAction<userAccountType | null>>,
    account: userAccountType | null,
    setSignin: React.Dispatch<React.SetStateAction<boolean>>,
    signin: boolean,
    isSignin: boolean,
    setIsSignin: React.Dispatch<React.SetStateAction<boolean>>,
    session: Session | null,
    status: "loading" | "authenticated" | "unauthenticated"
    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
    msg: msgType,
    setUsers: React.Dispatch<React.SetStateAction<userType[]>>,
    users: userType[],
    setUser: React.Dispatch<React.SetStateAction<userType | null>>
    user: userType | null,
    setClient: React.Dispatch<React.SetStateAction<userType | null>>,
    client: userType | null,
    allUsers: userType[],
    setGenMsg: React.Dispatch<React.SetStateAction<msgType>>
    setAllUsers: React.Dispatch<React.SetStateAction<userType[]>>,
    genMsg: msgType,
    setUserId: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string | null,

    setSignup: React.Dispatch<React.SetStateAction<boolean>>,
    signup: boolean,
    setPageHit: React.Dispatch<React.SetStateAction<mainPageHit | undefined>>,
    pageHit: mainPageHit | undefined,
    setClose: React.Dispatch<React.SetStateAction<boolean>>,
    close: boolean,
    setContact: React.Dispatch<React.SetStateAction<contactType>>,
    contact: contactType,
    setPageHitArr: React.Dispatch<React.SetStateAction<[] | mainPageHit[]>>
    pageHitArr: mainPageHit[] | []
    posts: postType[],
    setPosts: React.Dispatch<React.SetStateAction<postType[]>>,
    post: postType,
    setUserPosts: React.Dispatch<React.SetStateAction<postType[]>>,
    userPosts: postType[],
    setPost: React.Dispatch<React.SetStateAction<postType>>,
    fileLikes: likefileType[],
    setFileLikes: React.Dispatch<React.SetStateAction<likefileType[]>>,
    postLikes: likepostType[],
    setPostLikes: React.Dispatch<React.SetStateAction<likepostType[]>>,
    fileRates: ratefileType[],
    setFileRates: React.Dispatch<React.SetStateAction<ratefileType[]>>,
    postRates: ratepostType[],
    setPostRates: React.Dispatch<React.SetStateAction<ratepostType[]>>,
    setGenInfo: React.Dispatch<React.SetStateAction<genInfoType[]>>,
    genInfo: genInfoType[],
    setGetError: React.Dispatch<React.SetStateAction<string>>,
    getError: string

}
export const GeneralContext = React.createContext<generalContextType>({} as generalContextType);

const GeneralContextProvider = (props: any) => {
    const { data: session, status } = useSession();
    const [account, setAccount] = React.useState<userAccountType | null>(null);
    const [signin, setSignin] = React.useState<boolean>(false);
    const [isSignin, setIsSignin] = React.useState<boolean>(false);
    const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [users, setUsers] = React.useState<userType[]>([]);
    const [user, setUser] = React.useState<userType | null>(null);
    const [client, setClient] = React.useState<userType | null>(null);
    const [allUsers, setAllUsers] = React.useState<userType[]>([]);
    const [genMsg, setGenMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [userId, setUserId] = React.useState<string | null>(null);


    const [signup, setSignup] = React.useState<boolean>(false);
    const [pageHit, setPageHit] = React.useState<mainPageHit | undefined>();
    const [pageHitArr, setPageHitArr] = React.useState<mainPageHit[] | []>([]);

    const [close, setClose] = React.useState<boolean>(false);
    const [contact, setContact] = React.useState<contactType>({} as contactType);
    const [posts, setPosts] = React.useState<postType[]>([]);
    const [post, setPost] = React.useState<postType>({} as postType);
    const [fileRates, setFileRates] = React.useState<ratefileType[]>([]);
    const [fileLikes, setFileLikes] = React.useState<likefileType[]>([]);
    const [postRates, setPostRates] = React.useState<ratepostType[]>([]);
    const [postLikes, setPostLikes] = React.useState<likepostType[]>([]);
    const [userPosts, setUserPosts] = React.useState<postType[]>([]);
    const [genInfo, setGenInfo] = React.useState<genInfoType[]>([]);
    const [getError, setGetError] = React.useState<string>("");

    React.useMemo(async () => {
        try {
            const { data } = await axios.get(`/api/getpagehits`);
            const body: mainPageHit[] | undefined = await data;
            if (!body) return
            return setPageHitArr(body)
        } catch (error) {
            let message: string = `${getErrorMessage(error)}@api/getpagehits`
            setGetError(message)
            return console.error(message)
        }
        ;
    }, []);


    React.useEffect(() => {
        const recordHit = async () => {
            if (!pageHit) return
            try {
                await axios.post(`/api/page-hit`, pageHit);
                //components
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/page-hit`
                setGetError(message)
                return console.error(message)
            }
        }
        if (pageHit) {
            recordHit();
        }
    }, [pageHit]);

    React.useEffect(() => {
        const getGenInfo = async () => {

            try {
                const { data } = await axios.get(`/api/geninfo`);
                //components
                const body: genInfoType[] = await data as genInfoType[];

                setGenInfo(body);
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/generalInfo`
                setGetError(message)
                return console.log(message)
            }
        }

        getGenInfo();

    }, []);


    return (
        <GeneralContext.Provider value={{ account, setAccount, signin, setSignin, isSignin, setIsSignin, session, status, msg, setMsg, users, setUsers, allUsers, setAllUsers, genMsg, setGenMsg, userId, setUserId, signup, setSignup, setPageHit, pageHit, setClose, close, user, setUser, client, setClient, contact, setContact, pageHitArr, setPageHitArr, posts, setPosts, setPost, post, postLikes, setPostLikes, postRates, setPostRates, fileLikes, setFileLikes, fileRates, setFileRates, userPosts, setUserPosts, genInfo, setGenInfo, getError, setGetError }}>
            {props.children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider