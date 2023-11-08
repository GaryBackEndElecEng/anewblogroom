import React from 'react'
import type { msgType } from "@lib/Types";

type MsgType = {
    msg: msgType;
    setMsg: React.Dispatch<React.SetStateAction<msgType>>
}
export default function Msg({ msg, setMsg }: MsgType) {
    const msgStyle = msg.loaded ? "text-slate-200 text-3xl " : "text-red-700 text-3xl"

    React.useEffect(() => {
        if (msg && msg.loaded) {
            setTimeout(() => {
                setMsg({ loaded: false, msg: "" })
            }, 3500);
        }
    }, [msg]);

    return (
        <div className="flex flex-col justify-center items-center my-5 px-3 mx-auto">
            {msg.loaded && msg.msg ? (
                <h1 className={msgStyle}>{msg.msg}</h1>
            ) : (
                <h1 className={msgStyle}>{msg.msg}</h1>
            )}
        </div>
    )
}
