"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import { reduceModAndAddComp, } from "@lib/generalFunc";
import SavedMsg from "@component/comp/SavedMsg";
import { updateInputOnly } from '@/lib/fetchTypes';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeletePopUp2 from './DeletePopUp2';

type mainHeader = {
    input: inputType
}

export default function Heading({ input }: mainHeader) {

    const subject = 'heading';
    const initHeading: inputType | null = input.name === subject ? input : null

    const { setFile, file, setSaved, saved, setMsg, msg, setSelect } = React.useContext(InputContext);
    const [heading, setHeading] = React.useState<inputType | null>(initHeading);
    const [popup, setPopup] = React.useState<boolean>(false);
    const [deleteUnit, setDeleteUnit] = React.useState<inputType | undefined>()

    const show = input.name === subject ? true : false;


    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!heading) return
        if (!file) return
        const update_input = await updateInputOnly(heading);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }



    const container = show ? "mx-auto flex flex-col gap-2 lg:container" : "hidden";
    const subContainer = "mx-auto flex flex-col gap-2";
    const form = "mx-auto flex flex-row gap-2";
    const inputStyle = "mx-auto flex flex-col justify-evenly items-center w-full lg:w-1/2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";
    const titleStyle = "heading text-center text-white font-bold decoration-dash shadow shadow-grey-400 p-2 rounded-lg prose prose-lg";

    return (

        <div className={container}>
            <SavedMsg saved={saved} />

            {heading && show &&
                <div className={subContainer}>
                    <details style={{ margin: "auto", position: "relative" }}>
                        <BrowserUpdatedIcon sx={{ m: 1, color: "red" }} onClick={(e) => handleSend(e)}
                            className="absolute -right-5 -top-5"
                        />
                        <CloseIcon sx={{ m: 1, color: "red" }} onClick={() => setPopup(true)}
                            className="absolute -left-5 -top-5"
                        />
                        <div className="absolute left-0 top-0">
                            {popup && <DeletePopUp2
                                popup={popup}
                                setPopup={setPopup}
                                input={heading}
                            />}
                        </div>
                        <summary className={button}>{subject}</summary>
                        <div className={form}>
                            <label htmlFor={String(heading.id)}>{heading.name}</label>
                            <input
                                id={String(heading.id)}
                                required
                                name={heading.name}
                                aria-label={heading.name}
                                className="text-black"
                                type="text"
                                value={heading.content ? heading.content : ""}
                                onChange={(e) => {
                                    setHeading({ ...heading, content: e.target.value })
                                    return
                                }}
                            />
                        </div>

                    </details>
                    <h4 id={String(heading.id)} className={titleStyle}>{heading.content && heading.content}</h4>
                </div>
            }


        </div>

    )
}