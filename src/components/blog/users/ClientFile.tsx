import React from 'react'
import Link from "next/link";
import Image from "next/image";
import getFormattedDate from "@lib/getFormattedDate";
import type { fileType, userTypeShort } from "@lib/Types";

type mainClienFileType = {
    file: fileType,
    client: userTypeShort | null
}
export default function ClientFile({ file, client }: mainClienFileType) {
    const link = "/blog/usershomelinks/"
    const flexcol = "flex flex-col mx-auto w-full px-3 my-2";
    const title1 = "text-center font-bold text-3xl";
    return (
        <main className="col-span-1 card  ">
            {file.imageUrl && <Image src={file.imageUrl} width={600} height={400} className="aspect-video" alt={`${file.name}-${client && client.name}`} />}
            <Link href={`${link}/${client && client.name && client.name.replace(" ", "-")}/${file.id}`} className={flexcol} >
                <div className={" m-auto"}>
                    <h3 className={title1}>{file.title}</h3>
                    <div className={flexcol}>
                        <p className="sm:mx-auto text-xl sm:leading-10">{file.content}</p>
                    </div>
                    <div className="flex-flex-row flex-wrap justify-content">
                        <small className="my-2 mx-auto">{client && client.name}</small>
                        <small className="my-2 mx-auto">{(file && file.date) && getFormattedDate(file?.date)}</small>

                    </div>
                </div>
            </Link>

        </main>
    )
}
