"use client"
import React from 'react';
import { inputType, } from "@lib/Types";
import { GeneralContext } from '@context/GeneralContextProvider';
import CloseIcon from '@mui/icons-material/Close';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import DeletePopUp2 from "@component/comp/DeletePopUp2";
import { InputContext } from '../context/InputTypeProvider';
import { updateInput, storeLinks } from '@/lib/fetchTypes';
import SavedMsg from './SavedMsg';
import { updatefileInput } from '@/lib/generalFunc';

type hlinkType = {
    input: inputType
}


export default function HLink({ input }: hlinkType) {

    const subject = "link"
    const init: inputType | null = input.name === subject ? input : null;
    const { setMsg, msg } = React.useContext(GeneralContext);
    const { file, setFile, saved, setSaved, setGetlinks, getlinks } = React.useContext(InputContext);
    const [popup, setPopup] = React.useState<boolean>(false);
    const [pass, setPass] = React.useState<boolean>(false);
    const [hlink, setHlink] = React.useState<inputType | null>(init);
    const [isSaved, setIsSaved] = React.useState<boolean>(false);
    // const [acc, setAccum] = React.useState<inputType[]>([]);
    const show = input.name === subject ? true : false;
    const hlRegex: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

    React.useEffect(() => {
        if (!isSaved) return

    }, [isSaved]);

    React.useEffect(() => {
        if (!hlink) return
        const test: boolean = hlRegex.test(hlink.content)
        setPass(test)
    }, [hlink]);

    const handleSend = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();

        if (!pass) return setMsg({ loaded: false, msg: "must start with http:// or https:// and end with .com/ca/eu,,,,etc" })
        if (!hlink) return
        setIsSaved(false);
        const update_input = await updateInput(hlink);
        if (!file) return
        if (update_input) {
            const newFile = updatefileInput(file, update_input)
            setFile(newFile);
            setSaved({ loaded: true, msg: "saved" })
            setIsSaved(true);
            await SaveLink();
        }
        return setTimeout(() => { setMsg({ loaded: false, msg: "" }) }, 3000);

    }

    const SaveLink = async () => {
        if (!hlink || !getlinks) return
        const storedLink = await storeLinks(getlinks, hlink)
        if (!storedLink) return setMsg({ loaded: false, msg: "did not upload(link)" });
        const reLinks = getlinks.filter(lnk => (lnk.id !== storedLink.id))
        setGetlinks([...reLinks, storedLink])
        return setMsg({ loaded: true, msg: "saved" });


    }
    const handleLink = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (window && hlink) {
            window.open(hlink.content, "blank");
            return
        }


    }

    const container = show ? "mx-auto flex flex-col gap-2 lg:container mb-10" : "hidden";
    const msgStyle = `${pass ? "mx-auto text-center font-bold text-white text-xl" : "mx-auto text-center font-bold text-red-900 text-xl"}`;
    const form = "mx-auto flex flex-row gap-3 flex-wrap";
    // const inputStyle = "mx-auto flex flex-col justify-evenly items-center w-full lg:w-1/2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";
    const linkStyle = "hlink text-center text-white font-bold decoration-dash shadow shadow-grey-400 p-2 rounded-lg prose prose-lg underline underline-offset-[0.25rem] hover:text-blue-900";
    return (
        <React.Fragment>
            <div className={container}>
                <SavedMsg saved={saved} />
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
                            input={hlink}
                            setPopup={setPopup}
                        />
                    </div>
                    <summary className={button}>{subject}</summary>
                    <div className={form}>
                        <label htmlFor={(hlink && hlink.id) ? `${String(hlink.id)}-link` : "hlink"}>{subject}</label>
                        <input
                            id={(hlink && hlink.id) ? `${String(hlink.id)}-link` : "hlink"}
                            type="url"
                            name={hlink ? hlink.name : "link"}
                            value={hlink ? hlink.content : "link"}
                            required
                            placeholder="https://example.com"
                            pattern="https://.*"
                            size={30}
                            className="text-black"
                            aria-label={hlink ? hlink.name : "link"}
                            onChange={
                                (e) => {
                                    if (!e.target) return
                                    let content: string = e.target.value
                                    setHlink({ ...input, content: content })
                                }}
                        />
                    </div>
                </details>
                {hlink && <a id={String(hlink.id)}
                    className={linkStyle}
                    onClick={(e) => handleLink(e)}
                >
                    {hlink.content && hlink.content}
                </a>}
                {msg.loaded && msg.msg ? (
                    <div className="mx-auto flex flex-col items-center justify-center">
                        <h3 className={msgStyle}>{msg.msg}</h3>
                    </div>
                )
                    :
                    (
                        <div className="mx-auto flex flex-col items-center justify-center">
                            <h3 className={msgStyle}>{msg.msg}</h3>
                        </div>
                    )
                }
            </div>
        </React.Fragment>
    )
}
