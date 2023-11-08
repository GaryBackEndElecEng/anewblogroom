"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import { TextField } from "@mui/material";
import { reduceModAndAddComp, } from "@lib/generalFunc";
import SavedMsg from "@component/comp/SavedMsg";
import { updateInputOnly } from '@/lib/fetchTypes';
import ParagraphCreator from './ParagraphCreator';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeletePopUp2 from './DeletePopUp2';

type mainHeader = {
    input: inputType
}

export default function Summary({ input }: mainHeader) {
    const subject = 'summary';
    const initSummary: inputType | null = input.name === subject ? input : null
    //----at Meta(top file) -id represents the BLOg ID---//

    const { setFile, file, setSaved, saved, setSelect } = React.useContext(InputContext);
    const [summary, setSummary] = React.useState<inputType | null>(initSummary);
    const [popup, setPopup] = React.useState<boolean>(false);

    const show = (input.name === subject) ? true : false;


    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!summary) return
        if (!file) return
        const update_input = await updateInputOnly(summary);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }



    const container = show ? "container mx-auto flex flex-col gap-2 lg:container w-full" : "hidden";
    const summaryInput = "mx-auto flex-1 flex-col justify-center items-center gap-2 w-full my-2";
    const summaryDisplay = "summary mx-auto lg:container w-full px-3 mx-2 py-2";
    const para = "text-white prose prose-md my-2 mx-auto px-2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 mb-4";

    return (
        <div className={container}>
            <SavedMsg saved={saved} />
            <section className={summaryInput}>
                <details style={{ margin: "auto", position: "relative" }}>
                    <BrowserUpdatedIcon sx={{ m: 1, color: "red" }} onClick={(e) => handleSend(e)}
                        className="absolute -right-5 -top-5"
                    />
                    <CloseIcon sx={{ m: 1, color: "red" }} onClick={() => setPopup(true)}
                        className="absolute -left-5 -top-5"
                    />
                    <div className="absolute left-0 top-0">
                        {popup &&
                            <DeletePopUp2
                                popup={popup}
                                setPopup={setPopup}
                                input={summary}
                            />}
                    </div>
                    <summary className={button}>{subject}</summary>
                    {summary && show &&
                        <React.Fragment>
                            <TextField
                                id={`${String(summary.id)}-summary`}
                                label={summary.name}
                                required
                                name={summary.name}
                                fullWidth={true}
                                multiline={true}
                                placeholder={"Enter the main concept of the blog"}
                                helperText={"Enter your summary (main concept) for the blog"}
                                minRows={4}
                                maxRows={10}
                                aria-label={summary.name}
                                className="text-black bg-white p-3 w-full"
                                value={(summary && summary.content) ? summary.content : ""}
                                onChange={(e) => {
                                    if (!summary) return
                                    setSummary({ ...summary, content: e.target.value })
                                    return
                                }}
                            />


                        </React.Fragment>
                    }

                </details>
                <section id={summary ? `${String(summary.id)}-summary` : ""} className={summaryDisplay}>
                    <div className={para}>
                        <ParagraphCreator content={(summary && summary.content) ? summary.content : ""} subject={subject} />

                    </div>
                </section>
            </section>

        </div>

    )
}