import { fileType, userType } from '@/lib/Types'
import getFormattedDate from '@/lib/getFormattedDate'
import Image from 'next/image'
import React from 'react'

type SignType = {
    file: fileType,
    user: userType | null
}
export default function UserSignatureBlock({ file, user }: SignType) {
    return (
        <div className="mx-auto w-full sm:w-1/3 lg:w-1/4 my-3 mt-10 sm:container flex flex-col justify-center items-center shadow shadow-white relative min-h-[18vh] gap-4 rounded-lg">
            <div className="  flex flex-row justify-end items-center gap-3 ml-1 sm:ml-[1.5rem] lg:ml-[5rem]">
                <small className="font-bold mt-1 mb-1 text-lg"> {user && user.name},</small>
                {user && user.image && user.name &&
                    <Image src={user.image} width={75} height={75} alt={user.name} className="imageRnd absolute top-0 left-3 lg:top-0 lg:left-3 sm:-top-4 sm:left-1" />
                }
            </div>
            <div className="  flex flex-row justify-end gap-3 ml-1 sm:ml-[1.5rem] lg:ml-[5rem]">
                <small className="font-bold mt-2"><q>{file && file.name}</q></small>
                <small className="font-bold mt-2">, {file && file.date && getFormattedDate(file.date)}</small>
            </div>
            <small className="font-bold mt-2 italic"><q>Thank you for your time.</q></small>
        </div>
    )
}
