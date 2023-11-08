"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import { TextField } from "@mui/material";
import SavedMsg from "@component/comp/SavedMsg";
import { reduceModAndAddComp, } from '@/lib/generalFunc';
import { updateInputOnly } from '@/lib/fetchTypes';
import ParagraphCreator from './ParagraphCreator';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeletePopUp2 from './DeletePopUp2';

type mainHeader = {
    input: inputType
}

export default function Section({ input }: mainHeader) {
    const subject = "section";
    const initSection: inputType | null = input.name === subject ? input : null;
    //----at Meta(top file) -id represents the BLOg ID---//

    const { setFile, file, setSaved, saved, setMsg, msg, setSelect } = React.useContext(InputContext);
    const [section_obj, setSection_obj] = React.useState<inputType | null>(initSection);
    const [popup, setPopup] = React.useState<boolean>(false);
    const [deleteUnit, setDeleteUnit] = React.useState<inputType | undefined>()

    const show = input.name === subject ? true : false;


    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        if (!section_obj) return
        if (!file) return
        const update_input = await updateInputOnly(section_obj);
        if (!update_input) return
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setSelect(null);
        }
    }


    const container = show ? "container mx-auto flex flex-col gap-2 container w-full  items-center justify-evenly my-2 mt-3" : "hidden";
    const sectionStyle = " section flex-1 w-full px-2 py-auto";
    const textSection = " form text-black bg-white p-3 w-full shadow shadow-orange-900 rounded-xl"
    const mainSection = "section mx-auto lg:container px-2 my-2 py-1 flex flex-col items-center justify-center w-full flex-1";
    const para = "section text-sm text-white flex-1 px-2 my-2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 text-white";


    return (
        <React.Fragment>
            {show &&
                <div className={container}>
                    <section className={sectionStyle}>
                        <SavedMsg saved={saved} />
                        <details style={{ margin: "auto", position: "relative" }}>
                            <BrowserUpdatedIcon sx={{ m: 1, color: "red" }} onClick={(e) => handleSend(e)}
                                className="absolute -right-5 -top-5"
                            />
                            <CloseIcon sx={{ m: 1, color: "red" }} onClick={() => setPopup(true)}
                                className="absolute -left-5 -top-5"
                            />
                            <div className="absolute left-4 -top-[80px]">
                                {popup && <DeletePopUp2
                                    popup={popup}
                                    setPopup={setPopup}
                                    input={section_obj}
                                />}
                            </div>
                            <summary className={button}>{subject}</summary>
                            {section_obj && show &&

                                <TextField
                                    id={`${String(section_obj.id)}-section`}
                                    label={section_obj.name}
                                    required
                                    name={section_obj.name}
                                    fullWidth={true}
                                    multiline={true}
                                    placeholder={"Enter the main concept of the blog"}
                                    helperText={"Enter your section that reinforces in-part, your subject"}
                                    minRows={4}
                                    maxRows={20}
                                    aria-label={section_obj.name}
                                    className={textSection}
                                    value={(section_obj && section_obj.content) ? section_obj.content : ""}
                                    onChange={(e) => {
                                        if (!section_obj) return
                                        setSection_obj({ ...section_obj, content: e.target.value })
                                        return
                                    }}
                                />

                            }
                        </details>
                    </section>

                    {section_obj &&

                        <section id={`${String(section_obj.id)}-section`} className={mainSection}>
                            <div className={para}>
                                <ParagraphCreator content={section_obj.content && section_obj.content} subject={subject} />

                            </div>
                        </section>


                    }
                </div>
            }
        </React.Fragment>

    )
}