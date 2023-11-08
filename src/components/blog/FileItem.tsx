"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fileType, inputType, userType } from '@/lib/Types';
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate";


export function retUser(users: userType[], userID: string) {
    const user: userType | undefined = users.find(user => (user.id === userID))
    if (user) return user
    return
}

type mainFileType = {
    file: fileType
    index: number,
    users: userType[] | [],
}

export default function FileItem({ file, index, users }: mainFileType) {
    const router = useRouter();
    const getDate: string | undefined = (file && file.date) ? getFormattedDate(file?.date) : undefined;
    const [user, setUser] = React.useState<userType>({} as userType)

    React.useEffect(() => {
        const getUser: userType | undefined = users.find(user => (user.id === file.userId))
        if (getUser) setUser(getUser)
    }, [users, file.userId, setUser]);

    const handleRoute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, file: fileType, user: userType) => {
        e.preventDefault();
        if (!(file && file.id)) return
        router.push(`/blog/${file.id}`)

    }

    const button = "mx-auto text-center px-3 py-1 border border-orange-300 shadow-lg shadow-white rounded-lg text-white flex flex-col  items-start justify-start gap-3 ";
    const handleStyle = "mx-auto text-center px-3 py-1 shadow-lg shadow-white rounded-lg text-white flex flex-col  items-center justify-start gap-3 cursor-pointer ";
    const span1 = "mx-1";
    const span2 = "mx-1 text-orange-600";
    const span3 = "mx-1 text-orange-600 text-2xl";
    const linkItem = "flex flex-col items-center justify-center w-full my-2 shadow shadow-white rounded-xl p-1"
    const imageStyle = " aspect-video  rounded-xl shadow shadow-orange-500 my-2"

    return (

        <div className={linkItem} >
            <h3 className="text-center font-bold underline underline-offset-8 text-orange-300 mb-4">{file.name}</h3>
            <div className={handleStyle} onClick={(e) => handleRoute(e, file, user)}>
                {file && file.imageUrl && file.imageUrl.startsWith("https") && <Image src={file.imageUrl} alt={file.title} width={600} height={400}
                    className={imageStyle} />}

                <h4 className="text-lg text-white text-center mx-auto justify-self-start">
                    <ArrowBackIosNewIcon sx={{ color: "orange" }} />
                    <span className={span3}> {file.title}</span>
                    <ArrowForwardIosIcon sx={{ color: "orange" }} />
                </h4>
                <p className="mx-auto px-3 py-2 my-2">{file.content}</p>
                <div className=" m-auto flex flex-row gap-3 font-bold justify-center mt-4 text-white">
                    <small>By:{user?.name}</small>
                    <small> {getDate}</small>
                </div>
            </div>

        </div>


    )
}
