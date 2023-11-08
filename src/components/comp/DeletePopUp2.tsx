import { inputType, } from '@/lib/Types'
import { removeComponent } from '@/lib/generalFunc'
import React from 'react'
import { InputContext } from '../context/InputTypeProvider'

type mainType = {
    popup: boolean,
    setPopup: React.Dispatch<React.SetStateAction<boolean>>,
    input: inputType | null,

}
const DeletePopUp2 = ({ popup, setPopup, input }: mainType) => {
    const { file, setFile, setMsg, setSelect } = React.useContext(InputContext);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!input || !file) return setMsg({ loaded: false, msg: "not deleted- no file" })
        const retFile = await removeComponent(file, input);
        if (!retFile) return;
        setFile(retFile)
        setMsg({ loaded: true, msg: `${input.name} has been deleted` });
        setSelect(null)
        setPopup(false);
        return setTimeout(() => { setMsg({ loaded: false, msg: "" }); }, 2500);

    }

    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 bg-black text-white z-1000";
    return (
        <div className={popup ? "flex flex-col mx-auto justify-evenly items-center" : "hidden"}>
            <h3 className="text-center w-full">Are you sure?</h3>
            <div className="flex flex-row gap-2 items-center justify-center">
                <button className={button} onClick={(e) => handleDelete(e)}>delete</button>
                <button className={button} onClick={() => setPopup(false)}>cancel</button>
            </div>
        </div>
    )
}

export default DeletePopUp2