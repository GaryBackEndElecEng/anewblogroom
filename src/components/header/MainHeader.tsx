
import React from 'react'
import SubHeader from "./SubHeader";
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import { Session } from 'next-auth';


export default async function MainHeader({ session }: { session: Session | null }) {


    return (
        <>
            <SubHeader session={session} />
        </>

    )
}
