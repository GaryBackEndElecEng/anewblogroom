"use client";
import React from 'react'
import { GeneralContext } from '../context/GeneralContextProvider';
import { Fab, TextField } from '@mui/material';
import { contactType, userAccountType } from '@/lib/Types';
import { sendContact } from "@lib/fetchTypes";

export default function Contact({ account }: { account: userAccountType }) {
    const { contact, setContact, setMsg, msg } = React.useContext(GeneralContext);
    React.useEffect(() => {
        if (!contact || !account?.data) return
        const userId: string = account && account.data.id
        setContact({ ...contact, userId: userId })
    }, [account,]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (contact && contact.content && contact.subject) {
            const body: contactType | undefined = await sendContact(contact);
            if (body) {

                setMsg({ loaded: true, msg: `sent :${body.subject}` });
                setTimeout(() => { setMsg({ loaded: false, msg: "" }) }, 3000);
                setContact({} as contactType)
            }
        }
    };
    const container = "contact relative mx-auto"
    const textSection = "border border-orange-300 rounded-lg ";
    const formStyle = "form flex flex-col mx-auto items-center justify-center p-1 text-sm bg-white text-black rounded-xl shadow shadow-blue-800"
    return (
        <div className={container}>
            <form className={formStyle} onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor={"subject"}>{"subject"}</label>
                <input
                    id={"subject"}
                    required
                    name={"subject"}
                    aria-label={"subject"}
                    type="text"
                    className="border border-blue-700 rounded-lg text-black px-1"
                    value={contact ? contact.subject : ""}
                    onChange={(e) => {
                        if (contact) {
                            setContact({ ...contact, subject: e.target.value })
                        }
                        return
                    }}
                />
                <label htmlFor={"content"}>{"can we help?"}</label>
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
                    value={(contact && contact.content) ? contact.content : ""}
                    onChange={(e) => {
                        if (!contact) return
                        setContact({ ...contact, content: e.target.value })
                        return
                    }}
                />
                <Fab variant="extended" type="submit" size="small" className={"mt-2 mb-1 mx-auto hover: bg-blue-800 hover:text-white bg-emerald-400 text-black"}>
                    send
                </Fab>
            </form>
            {msg.loaded && msg.msg ?
                (<div className="inset-0 absolute bg-whitesmoke text-black mx-auto p-1">
                    <h4 className="text-center font-bold my-2 mx-auto"> {contact && contact.subject}</h4>
                    <p className="text-center font-bold mt-1 mx-auto"> {contact && contact.content}</p>
                </div>)
                :
                (msg.msg && <div className="inset-0 absolute bg-whitesmoke text-red-800 mx-auto p-1">
                    <h4 className="text-center font-bold my-2 mx-auto"> {contact && contact.subject} was not sent</h4>
                </div>)
            }
        </div>

    )
}
