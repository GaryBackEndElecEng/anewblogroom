
import React from 'react'
import SubHeader from "./SubHeader";
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';


export default async function MainHeader() {
    const session = await getServerSession(authOptions);

    return (
        <>
            <SubHeader session={session} />
        </>

    )
}
