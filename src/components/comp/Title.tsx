"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType } from "@lib/Types";
import { reduceModAndAddComp, } from "@lib/generalFunc";
import SavedMsg from "@component/comp/SavedMsg";
import { updateInputOnly } from '@/lib/fetchTypes';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';

type mainHeader = {
    input: inputType
}

export default function Title({ input }: mainHeader) {
    const subject = 'title';
    const show = (input.name === subject) ? true : false;
    const initTitle: inputType | null = show ? input : null;

    const { setFile, file, setSaved, saved, setSelect } = React.useContext(InputContext);
    const [title, setTitle] = React.useState<inputType | null>(initTitle)




    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!title) return
        if (!file) return
        const update_input = await updateInputOnly(title);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }



    const subContainer = "mx-auto flex flex-row gap-2 relative";
    const container = show ? "mx-auto flex flex-col gap-2 lg:container" : "hidden";
    const titleStyle = "text-center text-white font-bold underline underline-offset-8 shadow shadow-grey-400 p-2 rounded-lg prose prose-lg";
    const titleContainer = "title flex flex-col w-1/2 mx-auto container"
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";
    const parentDetail = "mx-auto lg:container w-1/ flex flex-col items-center justify-center "



    return (
        <div className={container}>
            <SavedMsg saved={saved} />
            {title &&
                <div className={parentDetail}>
                    <details style={{ margin: "auto", position: "relative" }}>
                        <BrowserUpdatedIcon sx={{ m: 1, color: "red" }} onClick={(e) => handleSend(e)}
                            className="absolute -right-5 -top-5"
                        />
                        <summary className={button}>{subject}</summary>
                        <div className={subContainer}>

                            {title && show &&
                                <React.Fragment >
                                    <label htmlFor={`${String(title.id)}-title`}>{title.name}</label>
                                    <input
                                        id={`${String(title.id)}-title`}
                                        required
                                        name={title.name}
                                        aria-label={title.name}
                                        className="text-black"
                                        type="text"
                                        value={title.content ? title.content : ""}
                                        onChange={(e) => {
                                            setTitle({ ...title, content: e.target.value })
                                            return
                                        }}
                                    />
                                </React.Fragment>

                            }
                        </div>
                    </details>
                </div>
            }
            <div className={titleContainer}>
                <h3 id={title ? `${String(title.id)}-title` : ""} className={titleStyle}>{title && title.content}</h3>
            </div>
        </div>

    )
}
