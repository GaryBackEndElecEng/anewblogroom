import React from 'react';
import Image from "next/image";
import { userType } from '@/lib/Types';
import styles from './header.module.css';

export default function UsersImage({ user, username }: { user: userType | null, username: string | null }) {
    const isUserImage: boolean = (user && user.image) ? true : false;
    const imageStyle = `rounded-full border-2 border-slate-700 shadow-lg shadow-slate-900 p-1/2 ${isUserImage ? "" : "bg-black"}`;
    const container = `${styles.bgImage} flex flex-col justify-center items-center m-1`;
    const src = (user && user.image) ? user.image : "/images/gb_logo.png";
    const alt: string = (user && user.image) ? user.name as string : "www.garymasterconnect.com"
    return (
        <div className={container}>
            <Image
                src={src}
                width={75}
                height={75}
                alt={alt && alt as string}
                className={imageStyle}
            />
            <h3 className={` ${styles.username} text-4xl font-bold`}>{username}</h3>
        </div>
    )
}
