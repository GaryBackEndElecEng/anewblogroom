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

export default function SubHeading({ input }: mainHeader) {
    const subject = 'subHeading';
    const initHeading: inputType | null = input.name === subject ? input : null
    //----at Meta(top file) -id represents the BLOg ID---//

    const { setFile, file, setSaved, saved, setSelect } = React.useContext(InputContext);
    const [subHeading, setSubHeading] = React.useState<inputType | null>(initHeading);
    const [popup, setPopup] = React.useState<boolean>(false);

    const show = (input.name === subject) ? true : false;

    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!subHeading) return
        if (!file) return
        const update_input = await updateInputOnly(subHeading);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }



    const container = show ? "container mx-auto flex flex-col gap-2 lg:container borber border-white" : "hidden";
    const titleStyle = "subHeading text-center text-white font-bold p-2 borber border-white ";
    const inputStyle = "mx-auto flex flex-col justify-evenly items-center w-full lg:w-1/2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";
    const parentDetail = "mx-auto lg:container flex flex-col items-center justify-center "


    return (

        <div className={container}>

            <SavedMsg saved={saved} />
            {subHeading && show &&

                <div className={parentDetail}>
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
                                input={subHeading}
                            />}
                        </div>
                        <summary className={button}>{subject}</summary>
                        <div className={inputStyle}>
                            <label htmlFor={`${String(subHeading.id)}-subHeading`}>{subHeading.name}</label>
                            <input
                                id={`${String(subHeading.id)}-subHeading`}
                                required
                                name={subHeading.name}
                                aria-label={subHeading.name}
                                className="text-black"
                                type="text"
                                value={subHeading.content ? subHeading.content : ""}
                                onChange={(e) => {
                                    setSubHeading({ ...subHeading, content: e.target.value })
                                    return
                                }}
                            />
                        </div>
                    </details>
                    <h4 id={`${String(subHeading.id)}-subHeading`} className={titleStyle}>{subHeading.content && subHeading.content}</h4>
                </div>

            }


        </div>

    )
}