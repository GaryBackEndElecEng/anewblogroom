"use client"
import React from 'react';
import { TextField } from "@mui/material";
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import { reduceModAndAddComp, } from "@lib/generalFunc";
import SavedMsg from "@component/comp/SavedMsg";
import { updateInputOnly } from '@/lib/fetchTypes';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeletePopUp2 from './DeletePopUp2';

type mainType = {
    input: inputType,
}
export default function ListComp({ input }: mainType) {
    const subject = "list";
    const show = input.name === subject ? true : false;
    const initList = show ? input : null;
    const { file, setFile, saved, setSaved, } = React.useContext(InputContext);
    const [listitem, setListitem] = React.useState<inputType | null>(initList);
    const [popup, setPopup] = React.useState<boolean>(false);



    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!listitem) return
        if (!file) return
        const update_input = await updateInputOnly(listitem);
        if (!update_input) return
        setListitem(update_input)
        if (update_input) {
            const newFile = reduceModAndAddComp(file, update_input);
            if (!newFile) return
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
        }

    };

    const formStyle = "listform flex flex-col w-full sm:w-3/4 my-2 px-3 mx-auto relative bg-white text-black ";
    const container = show ? "listContainer w-full relative  lg:container mx-auto my-2 mb-3" : "hidden";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";


    return (
        <div className={container} style={{ marginBottom: "3rem" }}>
            <SavedMsg saved={saved} />
            <details style={{ margin: "auto", position: "relative" }}>

                <CloseIcon sx={{ m: 1, color: "red" }} onClick={() => setPopup(true)}
                    className="absolute -left-5 -top-5"
                />
                <div className="absolute left-0 top-0">
                    <DeletePopUp2
                        popup={popup}
                        input={listitem}
                        setPopup={setPopup}
                    />
                </div>
                <summary className={button}>{subject}</summary>
                <form onSubmit={handleSend} className={formStyle}>
                    <TextField
                        id={`-list`}
                        label={listitem ? listitem.name : "listitem"}
                        required
                        name={"list"}
                        fullWidth={false}
                        multiline={true}
                        placeholder={"create a list,'-'or '1.)'"}
                        helperText={"Enter your listitem for your blog"}
                        minRows={4}
                        maxRows={12}
                        aria-label={"list"}
                        className="listTextField text-black  p-3 w-full"
                        value={(listitem && listitem.content) ? listitem.content : ""}
                        onChange={(e) => {
                            if (!listitem) return
                            setListitem({ ...listitem, content: e.target.value })
                            return
                        }}
                    />
                    <button
                        className="absolute bottom-2 right-1 buttonsm bg-slate-200"
                    >
                        <BrowserUpdatedIcon sx={{ color: "red", ml: 1, mr: 1, fontSize: "120%" }} />
                        submit
                    </button>
                </form>
            </details>
            <div className="flex flex-col mx-auto  mt-2 w-full px-3 py-2 sm:w-3/4 " >
                {listitem && show &&
                    <div className="mx-auto list flex-1 w-full" style={{ color: "white", font: "bold" }}>
                        <ConvertToList para={listitem.content} />
                    </div>
                }
            </div>
        </div>
    )
}

function ConvertToList({ para }: { para: string }) {
    // searchList

    const numLis: RegExp = /[0-9]+./gm; //This matches 1.),2.),,etc
    const hyphen: RegExp = /-/gm; //matches "-"
    const endHyphen: RegExp = /;/gm; //matches ";"
    const nextLine: RegExp = /\n/gm; //matches "return"
    const searchList = [
        { name: "hyphen", match: hyphen, repl: `<li>$& ` },
        { name: "num", match: numLis, repl: `<li>$&  ` },
        { name: "endHyphen", match: endHyphen, repl: "</li>" },
        { name: "endHyphen", match: nextLine, repl: "</li>" },
    ]
    let para2: string = "";
    const getResults = searchList.map((item, index) => {
        if (index === 0) {
            para2 = para
        }
        para2 = para2.replace(item.match, item.repl)
        return `<ul>${para2}</u>`
    });
    const results = getResults[getResults.length - 1]
    return (<div dangerouslySetInnerHTML={{ __html: results }} />)


}
