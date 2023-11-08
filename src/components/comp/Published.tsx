"use client"
import React from 'react'
import { InputContext } from '@context/InputTypeProvider'
import { fileType } from '@/lib/Types';
import { saveFile } from "@lib/fetchTypes"


type mainPubType = {
    setPublished: React.Dispatch<React.SetStateAction<boolean>>,
    published: boolean,
    get_file: fileType
}
export default function Published({ published, setPublished, get_file }: mainPubType) {
    const { setFile, setMsg, msg } = React.useContext(InputContext);

    const handleSend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!published) return
        let tempFile = { ...get_file, published: published } as fileType
        const retFile = await saveFile(tempFile);
        if (!retFile) return setMsg({ loaded: false, msg: "did not save" });
        setFile(retFile);
        setMsg({ loaded: true, msg: "saved" });
        setTimeout(() => { setMsg({ loaded: false, msg: "" }) }, 2000)
    }

    return (
        <div className="flex flex-col items-center justify-evenly">
            <div className="mx-auto lg:container flex flex-col sm:flex-row my-2 gap-3">
                <h3 className="text-center font-bold">Publish?</h3>
                <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="bg-slate-900 text-white border border-slate-300 p-2 rounded-lg"
                />
                <button className="shadow shadow-orange-600 px-3 py-auto text-white bg-black border border-orange-300 rounded-full " onClick={(e) => handleSend(e)}>publish</button>
            </div>
            {msg && msg.loaded && <h5 className="text-center font-bold my-3">{msg.msg}</h5>}
        </div>
    )
}
