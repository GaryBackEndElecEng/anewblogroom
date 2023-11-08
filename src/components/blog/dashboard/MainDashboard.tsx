"use client"
import React from 'react'
import { InputContext } from '@context/InputTypeProvider';
import DashBoard from './DashBoard';
import { userAccountType, userType } from '@/lib/Types';
import Login from "@component/comp/Login";
import { GeneralContext } from '@/components/context/GeneralContextProvider';

type mainContextType = {
    account: userAccountType | undefined,
    getuser: userType | undefined //FILE AND POSTS ARE COMPLETE
}
// USER'S DASHBOARD DISPLAYS ALL OF DASHBOARD!!!!!!!!
export default function MainDashboard({ account, getuser }: mainContextType) {
    const { setUserFiles } = React.useContext(InputContext);
    const { setUserPosts, setGetError } = React.useContext(GeneralContext);

    React.useEffect(() => {
        if (!getuser) {
            setGetError("did not get user info @blogs=>dashboard=> MainDashboard")
            return
        }
        setUserFiles(getuser.files);
        setUserPosts(getuser.posts);
    }, [setUserFiles, getuser, setUserPosts, setGetError])

    if (account && account.data && getuser) {

        return (
            <DashBoard account={account} getuser={getuser} />
        )
    } else {
        return (
            <div className="grid place-items-center min-h-[50vh]">
                <div className="flex flex-col items-center justify-center p-2">
                    <h3 className="text-3xl font-bold text-white my-2 mx-auto text-center">Login please</h3>
                    <h3 className="text-xl font-bold text-white mb-2 mx-auto text-center">if you do not have an account the please register</h3>
                    <Login />
                </div>
            </div>
        )
    }
}
