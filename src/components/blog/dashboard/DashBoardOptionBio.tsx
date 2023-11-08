import React from 'react';
import { Fab, TextField } from "@mui/material";
import { GeneralContext } from '../../context/GeneralContextProvider';
import { msgType, userType } from '@/lib/Types';
import { saveUser } from "@lib/fetchTypes";


export default function DashBoardOptionBio() {

    const [saved, setSaved] = React.useState<msgType | null>(null)
    const { setUser, user } = React.useContext(GeneralContext);
    const tempBio = (user && user.bio) ? user.bio : ""
    const [bio, setBio] = React.useState<string>(tempBio);
    const container = "flex flex-col justify-center items-center mx-auto w-full"
    const formStyle = "w-full rounded-lg border border-blue-400 p-1 px-2 bg-white flex flex-col justify-center items-center"
    const bioStyle = "w-full sm:w-3/4 mx-auto my-2"

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (e.currentTarget) {
            const tempUser: userType = { ...user, bio: bio } as userType
            const savedUser = await saveUser(tempUser);
            if (savedUser) {
                setUser(savedUser);
                setSaved({ loaded: true, msg: " saved" })
            } else { setSaved({ loaded: false, msg: "notSaved" }) }
            setTimeout(() => setSaved(null), 3000);

        }
    }
    return (
        <div className={container}>
            <details className={bioStyle}>
                <summary className="text-center text-xl font-bold my-2"> edit bio</summary>
                <form action="" onSubmit={handleSubmit} className={formStyle}>
                    <TextField
                        id="bio"
                        name="bio"
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        autoFocus={true}
                        helperText={"tell the reader about yourself"}
                        placeholder={"who you are"}
                        minRows={4}
                        maxRows={8}
                        variant={"filled"}
                        className="w-full"
                    />

                    <Fab type="submit" variant="extended" size="small" color="primary" className="my-2 p-1 px-3 bg-emerald-600 text-white hover:bg-slate-800">save</Fab>
                </form>
            </details>
            <div className="flex flex-col items-center justify-center">
                {(saved && saved.loaded && saved.msg) ? (
                    <h3 className="m-auto text-font text-blue-900">{saved.msg}</h3>
                ) :
                    saved && (
                        <h3 className="m-auto text-font text-blue-900">{saved.msg}</h3>
                    )}
            </div>
        </div>
    )
}
