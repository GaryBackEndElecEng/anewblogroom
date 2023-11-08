import { inputType } from '@/lib/Types'
import React from 'react'

type mainType = {
    popup: boolean,
    setPopup: React.Dispatch<React.SetStateAction<boolean>>,
    handle_DeletePopUp: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const DeletePopUp = ({ popup, handle_DeletePopUp, setPopup }: mainType) => {

    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 bg-black text-white z-1000";
    return (
        <div className={popup ? "flex flex-col mx-auto justify-evenly items-center" : "hidden"}>
            <h3 className="text-center w-full">Are you sure?</h3>
            <div className="flex flex-row gap-2 items-center justify-center">
                <button className={button} onClick={(e) => handle_DeletePopUp(e)}>delete</button>
                <button className={button} onClick={() => setPopup(false)}>cancel</button>
            </div>
        </div>
    )
}

export default DeletePopUp