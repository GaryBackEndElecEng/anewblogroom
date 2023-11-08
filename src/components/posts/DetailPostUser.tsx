"use client";
import React from 'react'
import type { userType } from "@lib/Types";
import Image from "next/image";
import styles from "@component/posts/posts.module.css";
import Link from 'next/link';

type mainUseType = {
    user: userType | null;
}
export default function DetailPostUser({ user }: mainUseType) {
    const url = "/images/gb_logo";
    return (
        <div className="mx-auto prose prose-md prose-invert px-1">
            {(user && user.name && user.bio) &&
                <div className="flex flex-col items-start justify-center mx-auto ">
                    <h3 className="text-center text-xl mb-2">{user.name}</h3>
                    <p className="text-lg leading-[1.25rem] text-slate-20 mx-auto px-1">
                        <Image
                            src={user.image ? user.image : " url"}
                            alt={user.name}
                            width={75}
                            height={75}
                            className={`${styles.userImg} rounded-full p-[0.25rem] shadow shadow-blue-600`}
                        />
                        {user.bio}
                    </p>
                    <div className="flex flex-row flex-wrap gap-3 mt-2 px-1">
                        {(user.files && user.files.length > 0) &&
                            user.files.map((file, index) => (
                                <React.Fragment key={index}>
                                    {
                                        file &&
                                        <Link href={file.fileUrl}
                                            className="cursore-pointer"
                                        >

                                            {file.title}

                                        </Link>
                                    }
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>}
        </div>
    )
}
