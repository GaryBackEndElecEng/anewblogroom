import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { msgType } from '@/lib/Types';

type MsgType_ = {
    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
    msg: msgType
}
export default function Msg({ setMsg, msg }: MsgType_) {
    const [isMsg, setIsMsg] = React.useState<boolean>(false);


    React.useEffect(() => {

        if (msg && (msg.msg || msg.loaded)) {
            setIsMsg(true);
            setTimeout(() => {
                setMsg({ loaded: false, msg: "" });
                setIsMsg(false);
            }, 3000);
        }
    }, [msg]);

    return (
        <React.Fragment>
            {isMsg &&
                <div className={`mx-auto flex flex-col items-center  p-2 w-full ${(msg && msg.msg) ? " absolute top-[50%] inset-x-0 bg-white" : "hidden"}`}>
                    {msg.loaded ? (<h4 className="text-blue-900 shadow shadow-white mx-auto py-1 px-2 rounded-lg">{msg.msg}</h4>) : (<h4 className="text-red-800 prose-lg text-2xl shadow shadow-red mx-auto py-1 px-2 rounded-lg">{msg.msg}</h4>)}
                </div>
            }
        </React.Fragment>
    )
}
