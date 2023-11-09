
import React from 'react';
import MainDashboard from "@/components/blog/dashboard/MainDashboard"
import { getUserAccount, getUser_ } from "@lib/serverGets";
// import { getEmailUser } from "@lib/fetchTypes";


export default async function page() {
    const account = await getUserAccount();
    const getuser = await getUser_();//ALL FILES AND POSTS COMPLETE

    return (
        <React.Fragment>
            <MainDashboard account={account} getuser={getuser} />
        </React.Fragment>
    )

}

