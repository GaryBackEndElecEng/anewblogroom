"use client";
import React from 'react';
import { GeneralContext } from "@context/GeneralContextProvider";
import { InputContext } from "@context/InputTypeProvider";
import { contactType } from "@lib/Types";
import { FormControl, Input, FormLabel, TextField } from "@mui/material";
import styles from "@component/emails/signup.module.css";
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from "@mui/material";
import axios from 'axios';



const SignUp = () => {
    const { setMsg, msg, setSignup, signup, setClose } = React.useContext(GeneralContext);
    const [contact, setContact] = React.useState<contactType>({} as contactType)



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/email", contact);
            const body: contactType = await data
            setTimeout(() => { setClose(true) }, 1200);
            setContact({} as contactType)
            setMsg({ loaded: true, msg: "sent" });
            setSignup(false);
            setClose(false);

        } catch (error) {
            setMsg({ loaded: false, msg: `did not send email` })
            console.error(new Error("cantact data was not recieved"))
        }

    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContact({
        ...contact,
        [e.target.name]: e.target.value
    });
    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setClose(true);
        setSignup(false);
    }

    return (
        <>
            {signup ?
                <div className={`${styles.masterSignup} absolute `}>

                    <div className="relative m-auto flex flex-col items-center justify-center w-full z-1000 bg-slate-400 ">
                        <h2 className="text-primary-700 text-center prose mb-3 underline underline-offset-8">Blog Room</h2>
                        <h3 className="text-primary-700 text-center prose mb-3 underline underline-offset-8">We	&#8216;ll keep you in the loop!</h3>
                        <IconButton onClick={(e) => handleClose(e)}
                            className={`${styles.cancelIcon} absolute `}
                        >
                            <CancelIcon sx={{ color: "red" }} />
                        </IconButton>
                        <form action="" onSubmit={(e) => handleSubmit(e)}
                            className="flex flex-col items-center gap-0 p-3 z-2 shadow shadow-blue-300 rounded-lg bg-slate-100 rounded-lg"
                        >
                            <FormControl>
                                <FormLabel htmlFor="email" className="text-sm ">email</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={contact.email}
                                    onChange={(e) => handleOnChange(e)}
                                    className="border border-blue rounded-lg text-sm"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="subject" className="text-sm">subject</FormLabel>
                                <Input
                                    id="subject"
                                    name="subject"
                                    type="subject"
                                    required
                                    value={contact.subject}
                                    onChange={(e) => handleOnChange(e)}
                                    className="border border-blue rounded-lg text-sm"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="content" className="text-sm">content</FormLabel>
                                <TextField
                                    label={"your content"}
                                    id="content"
                                    name="content"
                                    type="text"
                                    minRows={4}
                                    maxRows={8}
                                    required
                                    fullWidth={true}
                                    value={contact.content}
                                    onChange={(e) => handleOnChange(e)}
                                    className="border border-blue rounded-lg text-sm"
                                />
                            </FormControl>
                            <button className="shadow shadow-blue rounded-full px-3 py-1 border border-blue mt-2 text-sm" type="submit">signUp</button>
                        </form>
                        <div className="flex flex-col items-center text-center">
                            {msg.loaded ?
                                <h5 className="text-blue m-auto">{msg.msg}</h5>
                                :
                                <h5 className="text-orange m-auto">{msg.msg}</h5>
                            }
                        </div>

                    </div>

                </div>
                : <React.Fragment></React.Fragment>

            }
        </>
    )
}

export default SignUp