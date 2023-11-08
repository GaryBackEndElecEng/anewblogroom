import React from 'react';
import type { fileType, userType } from "@lib/Types";
import PopUp from "@component/comp/PopUp";
import { TextField } from '@mui/material';
import { InputContext } from '@/components/context/InputTypeProvider';
import DashBoard from './DashBoard';

type FileFormType = {
    file: fileType | null,
    setFile: React.Dispatch<React.SetStateAction<fileType | null>>,
    user: userType | null,
    setSignup: React.Dispatch<React.SetStateAction<boolean>>,
    signup: boolean,
}
export default function DashBoardFileForm({ file, setFile, user, signup, setSignup }: FileFormType) {
    const { date, inputArr, setSelect, select } = React.useContext(InputContext);


    const Form = "mx-auto lg:container flex  flex-col flex-wrap  items-center gap-3 justify-start sm:justify-evenly w-full relative ";

    const textfield = "text-black bg-white rounded-lg border border-blue-900 shadow shadow-white border border-red-900 cursor-pointer ";
    const textarea = "text-black bg-white rounded-lg border border-blue-900 shadow shadow-white border border-red-900 w-full ";


    return (
        <div className={Form}>

            <div className="mx-auto flex flex-col gap-2">
                {user &&
                    <h4 className={"text-center font-bold"}>{user.name}</h4>
                }
            </div>
            <div className="mx-auto flex flex-col my-2 text-white">
                {file &&
                    <TextField
                        id={`${file.id}-${file.name}`}
                        required
                        label={"filename"}
                        name="filename"
                        aria-label="filename"
                        // helperText={" name"}
                        multiline={false}
                        className={textfield}
                        size={"small"}
                        placeholder={"filename"}
                        type="text"
                        value={file.name ? file.name : ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                const filename = e.target.value.trim().replace(" ", "-")
                                setFile({ ...file, name: filename });
                            }
                        }}
                    />}
            </div>
            <div className="mx-auto flex flex-col my-2 text-white">
                {file &&
                    <TextField
                        id={`${file.id}-${file.title}`}
                        required
                        label={"title"}
                        name="title"
                        aria-label="title"
                        // helperText={" name"}
                        multiline={false}
                        className={textfield}
                        size={"small"}
                        placeholder={"title,,HOW TOO,WHY,,,USE 5Ws"}
                        type="text"
                        value={file.title ? file.title : ""}
                        onChange={(e) => {
                            // if (!file.name) return
                            setFile({ ...file, title: e.target.value });
                        }}
                    />}
            </div>
            <div className="mx-auto flex flex-col my-2 text-white w-full px-3">
                {file &&
                    <TextField
                        id={`${file.id}-${file.title}-2`}
                        required
                        label={"summary"}
                        name="content"
                        aria-label="summary"
                        // helperText={" name"}
                        multiline={true}
                        minRows={7}
                        margin={"dense"}
                        className={textarea}
                        size={"medium"}
                        placeholder={"content: HAVE A BOLD STATEMENT TO HOOK"}
                        type="text"
                        variant={"filled"}
                        value={file.content ? file.content : ""}
                        onChange={(e) => {
                            // if (!file.name) return
                            setFile({ ...file, content: e.target.value });
                        }}
                    />}
            </div>


            <PopUp signup={signup} setSignup={setSignup} />
        </div>
    )
}
