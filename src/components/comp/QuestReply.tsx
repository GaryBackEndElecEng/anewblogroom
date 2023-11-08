"use client";
import React from 'react'
import { GeneralContext } from '../context/GeneralContextProvider';
import { Fab, TextField } from '@mui/material';
import { dataReplyType, inputType } from '@lib/Types';
import { getUserInfo, sendEmail } from "@lib/fetchTypes";
import { usePathname } from "next/navigation";
import SendIcon from '@mui/icons-material/Send';

type replyType = {
    input: inputType | null,
    setOpenReply: React.Dispatch<React.SetStateAction<boolean>>,
    openReply: boolean
}
export default function QuestReply({ input, setOpenReply, openReply }: replyType) {
    const subject = "question"
    const show = input && input.name === subject ? true : false;
    const question: inputType | null = show ? input : null;
    const display = show ? "block" : "none";
    const pathname = usePathname();
    const { setMsg, msg, setUser, user } = React.useContext(GeneralContext);
    const [dataReply, setDataReply] = React.useState<dataReplyType>({} as dataReplyType)

    React.useMemo(async () => {
        if (!question) return
        if (!question.fileId) return

        const getUser = await getUserInfo(question.fileId);
        if (!getUser) return

        setUser(getUser)

    }, []);

    React.useEffect(() => {
        if (!user) return
        if (dataReply) {
            setDataReply({ ...dataReply, userId: user.id as string });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (dataReply && dataReply.content && dataReply.subject) {
            const body: dataReplyType | undefined = await sendEmail(dataReply);
            if (body) {

                setMsg({ loaded: true, msg: "Thanks for participating!- hope you enjoyed the read" });
                setTimeout(() => { setMsg({ loaded: false, msg: "" }) }, 3000);
                setDataReply({} as dataReplyType)
                setOpenReply(false)
            } else {
                setMsg({ loaded: false, msg: "sorry, try later on - something  happened" })
            }
        }
    };
    const container = openReply ? "dataReplyGrow" : "dataReplyShrink"
    const textSection = "border border-orange-300 rounded-lg ";
    const formStyle = openReply ? "dataReplyGrow flex flex-col mx-auto items-center justify-center p-1 text-sm bg-white text-black rounded-xl w-full" : "dataReplyShrink flex flex-col mx-auto items-center justify-center p-1 text-sm bg-white text-black rounded-xl w-full";

    return (
        <div className={container} style={{ display: display }}>
            <form className={formStyle} onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor={"email"}>email</label>
                <input
                    id={"email"}
                    name={"email"}
                    aria-label={"email"}
                    type="email"
                    className="border border-blue-700 rounded-lg text-black px-1"
                    value={dataReply ? dataReply.email : "example@gmail.com"}
                    onChange={(e) => {
                        if (dataReply) {
                            setDataReply({ ...dataReply, email: e.target.value })
                        }
                        return
                    }}
                />
                <label htmlFor={"subject"}>{"subject"}</label>
                <input
                    id={"subject"}
                    required
                    name={"subject"}
                    aria-label={"subject"}
                    type="text"
                    className="border border-blue-700 rounded-lg text-black px-1"
                    value={dataReply ? dataReply.subject : ""}
                    onChange={(e) => {
                        if (dataReply) {
                            setDataReply({ ...dataReply, subject: e.target.value })
                        }
                        return
                    }}
                />
                <label htmlFor={"content"}>{"your thought is important"}</label>
                <TextField
                    id={"content"}
                    label={"content"}
                    required
                    name={"content"}
                    fullWidth={true}
                    multiline={true}
                    placeholder={"message us!"}
                    helperText={"We'll get back to you ASAP"}
                    minRows={2}
                    maxRows={4}
                    aria-label={"content"}
                    className={textSection}
                    value={(dataReply && dataReply.content) ? dataReply.content : ""}
                    onChange={(e) => {
                        if (!dataReply) return
                        setDataReply({ ...dataReply, content: e.target.value })
                        return
                    }}
                />
                <Fab variant="extended" type="submit" size="small" className={"mt-2 mb-1 mx-auto hover: bg-blue-800 hover:text-white bg-emerald-400 text-black"}>
                    send <SendIcon sx={{ color: "red", fontSize: "120%", ml: 1 }} />
                </Fab>
            </form>
            {msg.loaded && msg.msg ?
                (<div className="inset-0 absolute bg-whitesmoke text-black mx-auto p-1">
                    <h4 className="text-center font-bold text-green-800 my-2 mx-auto"> {msg.msg}</h4>
                    <p className="text-center font-bold mt-1 mx-auto"> {dataReply && dataReply.content}</p>
                </div>)
                :
                (msg.msg && <div className="inset-0 absolute bg-whitesmoke text-red-800 mx-auto p-1">
                    <h4 className="text-center text-orange-800 font-bold my-2 mx-auto">{msg.msg}</h4>
                </div>)
            }
        </div>

    )
}
