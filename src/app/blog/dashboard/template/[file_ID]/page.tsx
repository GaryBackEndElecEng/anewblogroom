
import React from 'react';
import type { fileType } from '@/lib/Types';
import { getUser_, getFileDetail } from "@lib/serverGets"
import { getAccount, } from "@lib/nextAuth";
import MasterFileToEdit from "@/components/blog/dashboard/MasterFileToEdit";

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

///PATH TO EDIT THE CLIENT'S FILE FROM DASHBOARD BUTTON-EDIT
export default async function FileHandle({ params }: { params: { file_ID: string } }) {
    const { file_ID } = params;
    const file = await getFileDetail(file_ID);
    const account = await getAccount();
    const get_user = await getUser_();
    if (file && account && get_user) {
        return (
            <>
                <MasterFileToEdit
                    file={file}
                    get_user={get_user}
                    get_account={account}
                />
            </>
        )
    } else {
        <div className="grid place-items-center">
            <h3 className="text-2xl text-center font-bold">...could not find file</h3>
        </div>
    }
}
