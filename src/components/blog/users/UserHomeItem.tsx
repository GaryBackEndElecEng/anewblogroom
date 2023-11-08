import React from 'react'
import Link from "next/link";
import Image from "next/image";
import type { userType } from "@lib/Types";
import { Button, Fab } from "@mui/material";

type mainLinktype = {
    user: userType
}
export default function UserHomeItem({ user }: mainLinktype) {
    const logo = "/images/gb_logo.png"
    return (
        <div className="card p-2">
            <div className="flex flex-row flex-wrap px-2 my-2 justify-center items-center gap-4 mx-auto">
                {user.image ? <Image src={user.image} width={75} height={75} alt={`${user.name}`} className="imageRnd" />
                    :
                    <Image src={logo} width={75} height={75} alt={`${user.name}`} className="imageRnd" />
                }
                <h3 className="text-xl font-bold font-bold">{user.name}</h3>
            </div>
            {user.files && (user.files.length > 0) && <h3 className="text-center mb-2 text-slate-100 underline underline-offset-8">blogs</h3>}
            <div className="flex flex-row flex-wrap px-2 my-2 justify-center items-center gap-3 mx-auto">

                {user.files && user.files.map((file, index) => (<React.Fragment key={index}>
                    <h6 className="text-sm text-slate-300 mx-2">{file.name}</h6>
                </React.Fragment>))}
            </div>
            <h3 className="text-xl font-bold my-2 px-1">Description</h3>
            <p className="mx-auto px-1">{user.bio}</p>
            <Link href={`/blog/usershomelinks/${user.name?.replace(" ", "-")}`} >
                <Fab variant="extended" color="primary"
                > GOTO home</Fab>
            </Link>
        </div>
    )
}
