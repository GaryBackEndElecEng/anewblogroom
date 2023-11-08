import React from 'react';
import Button from "@component/comp/Button";
import { inputType } from '@/lib/Types';

type mainButtonType = {
    handleSend: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>,
    handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>,
    setPopup: React.Dispatch<React.SetStateAction<boolean>>,
    popup: boolean,
    setDeleteUnit: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    input: inputType | null
}
export default function ButtonGroup({ handleSend, handleDelete, setPopup, popup, setDeleteUnit, input }: mainButtonType) {


    return (
        <div className="flex flex-row gap-2 lg:gap-4 my-3 mx-auto justify-evenly items-center relative w-full lg:w-1/2  w-full">
            <Button color={"white"} shade={"rgba(150,100,200,.4)"} shadow={true} border={true} onClick={(e) => handleSend(e)}>save work?</Button>
            <Button color={"white"} shade={"rgba(250,100,100,.4)"} shadow={true} border={true} onClick={() => setPopup(true)}>delete item?</Button>
            <Warning handleDelete={handleDelete} popup={popup} setPopup={setPopup} setDeleteUnit={setDeleteUnit} input={input} />
        </div>
    )
}

type warnngButtonType = {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>,
    popup: boolean,
    handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>,
    setDeleteUnit: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    input: inputType | null
}

function Warning({ handleDelete, setPopup, popup, setDeleteUnit, input }: warnngButtonType) {

    React.useEffect(() => {
        if (popup && input) {
            setDeleteUnit(input);
        }
    }, [popup, setDeleteUnit, input]);

    return (
        <>
            {
                popup &&
                <div className="mx-auto absolute inset-0 flex flex-row justify-center items-center  py-2 bg-black rounded-xl w-full ">
                    <button className={"button cursor-pointer text-red/70 hover:text-red px-4  rounded-full border border-black"} onClick={(e) => handleDelete(e)}>
                        <h3 className="text-center ">sure?</h3>
                    </button>
                    <button className={"button cursor-pointer text-red/70 hover:text-red px-4  rounded-full border border-black"} onClick={(e) => setPopup(false)}>
                        <h3 className="text-center ">cancel</h3>
                    </button>
                </div>
            }
        </>
    )
}
