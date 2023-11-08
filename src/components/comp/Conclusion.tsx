"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import { TextField } from "@mui/material";
import { reduceModAndAddComp, } from "@lib/generalFunc";
import SavedMsg from "@component/comp/SavedMsg";
import { updateInputOnly } from '@/lib/fetchTypes';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ParagraphCreator from "@component/comp/ParagraphCreator";
import DeletePopUp2 from './DeletePopUp2';

type mainHeader = {
    input: inputType
}

export default function Conclusion({ input }: mainHeader) {

    const subject = 'conclusion';
    const initConclusion: inputType | null = input.name === subject ? input : null

    const { setFile, file, setSaved, saved, setMsg, setSelect } = React.useContext(InputContext);
    const [conclusion, setConclusion] = React.useState<inputType | null>(initConclusion);
    const [popup, setPopup] = React.useState<boolean>(false);
    const [deleteUnit, setDeleteUnit] = React.useState<inputType | undefined>()

    const show = (input.name === subject) ? true : false;




    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!conclusion) return
        if (!file) return
        const update_input = await updateInputOnly(conclusion);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }



    const container = "container mx-auto flex flex-col gap-2 w-full items-center justify-start flex-1";
    const textSection = " form text-black bg-white p-3 w-full shadow shadow-orange-900 rounded-xl flex-1"
    const setSectionInput = "mx-auto flex flex-col justify-start items-center gap-2 w-full";
    const setSectionDisplay = "conclusion mx-auto flex flex-col justify-start items-center gap-2 w-full flex-1";
    const para = "conclusion text-white prose prose-md my-2 mx-auto p-2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";


    return (

        <div className={container}>
            <SavedMsg saved={saved} />
            {conclusion && show &&
                <React.Fragment>
                    <details style={{ margin: "auto", position: "relative" }}>
                        <BrowserUpdatedIcon sx={{ m: 1, color: "red" }} onClick={(e) => handleSend(e)}
                            className="absolute -right-5 -top-5"
                        />
                        <CloseIcon sx={{ m: 1, color: "red" }} onClick={() => setPopup(true)}
                            className="absolute -left-5 -top-5"
                        />
                        <div className="absolute left-0 top-0">
                            <DeletePopUp2
                                popup={popup}
                                setPopup={setPopup}
                                input={conclusion}
                            />
                        </div>
                        <summary className={button}>{subject}</summary>
                        <TextField
                            id={String(conclusion.id)}
                            label={conclusion.name}
                            required
                            name={conclusion.name}
                            fullWidth={true}
                            multiline={true}
                            placeholder={"Enter the main concept of the blog"}
                            helperText={"Enter your summary (main concept) for the blog"}
                            minRows={4}
                            maxRows={20}
                            aria-label={conclusion.name}
                            className={textSection}
                            value={conclusion.content ? conclusion.content : ""}
                            onChange={(e) => {
                                setConclusion({ ...conclusion, content: e.target.value })

                                return
                            }}
                        />
                    </details>
                    <section className={setSectionDisplay}>
                        <h1 className="text-2xl text-center text-orange-900 font-bold mb-2"> CONCLUSION</h1>
                        <ParagraphCreator content={conclusion && conclusion.content && conclusion.content} subject={subject} />
                    </section>
                </React.Fragment>
            }


        </div>

    )
}