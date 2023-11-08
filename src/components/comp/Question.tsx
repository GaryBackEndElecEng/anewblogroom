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
import DeletePopUp2 from "@component/comp/DeletePopUp2";
import QuestReply from "@component/comp/QuestReply";
import { GeneralContext } from '../context/GeneralContextProvider';
import SendIcon from '@mui/icons-material/Send';




type mainHeader = {
    input: inputType
}

export default function Question({ input }: mainHeader) {

    const subject = 'question';
    const initQuestion: inputType | null = input.name === subject ? input : null

    const { setFile, file, setSaved, saved, setSelect } = React.useContext(InputContext);
    const [question, setQuestion] = React.useState<inputType | null>(initQuestion);
    const [openReply, setOpenReply] = React.useState<boolean>(false);
    const [popup, setPopup] = React.useState<boolean>(false);


    const show = (input.name === subject) ? true : false;





    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!question) return
        if (!file) return
        const update_input = await updateInputOnly(question);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }


    const handleReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!openReply) {
            setOpenReply(true);
        } else {
            setOpenReply(false);
        }
    }

    const container = show ? "container mx-auto flex flex-col gap-2 w-full items-center justify-start flex-1" : "hidden";
    const textSection = " form text-black bg-white p-3 w-full shadow shadow-orange-900 rounded-xl flex-1"
    const setSectionInput = "mx-auto flex flex-col justify-start items-center gap-2 w-full";
    const setSectionDisplay = "question mx-auto flex flex-col justify-start items-center gap-2 w-full flex-1 relative";
    const para = "question text-white prose prose-lg text-xl my-2 mx-auto p-2";
    const button = "flex flex-row justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 cursor-pointer";
    const openReplyStyle = openReply ? "flex flex-col justify-center items-start h-[40vh] w-full sm:w-3/4 lg:w-1/2 " : "flex flex-col justify-center"
    const quoteBlockStyle = "flex flex-col justify-center items-start"

    return (

        <div className={container}>
            <SavedMsg saved={saved} />
            {question && show &&
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
                            input={question}
                        />}
                    </div>
                    <summary className={button}>{subject}</summary>
                    <TextField
                        id={String(question.id)}
                        label={question.name}
                        required
                        name={question.name}
                        fullWidth={true}
                        multiline={false}
                        placeholder={"Ask a question to pull interaction"}
                        helperText={"A question, related to an omitted explaination relating to your subject."}
                        aria-label={question.name}
                        className={textSection}
                        value={question.content ? question.content : ""}
                        onChange={(e) => {
                            setQuestion({ ...question, content: e.target.value })

                            return
                        }}
                    />
                </details>

            }
            <section className={setSectionDisplay}>
                <p className={para}>{question && question.content && question.content}</p>
                <div className={quoteBlockStyle}>
                    <blockquote className="reply my-2 mx-auto">
                        {openReply ?
                            (
                                <button className={button} onClick={(e) => handleReply(e)}>
                                    close <CloseIcon sx={{ ml: 1, color: "red" }} />
                                </button>
                            )
                            :
                            (
                                <button className={button}

                                    onClick={(e) => handleReply(e)}>
                                    <span>reply</span> <SendIcon sx={{ color: "orange", ml: 1 }} />
                                </button>
                            )
                        }
                    </blockquote>
                </div>
                {openReply &&
                    <div className={`${openReplyStyle} relative`}>
                        <QuestReply input={question && question} openReply={openReply} setOpenReply={setOpenReply} />
                    </div>
                }
            </section>

        </div>

    )
}