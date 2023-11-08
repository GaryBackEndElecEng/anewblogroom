"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, } from "@lib/Types";
import SavedMsg from "@component/comp/SavedMsg";
import { inputFreeze, removeComponent } from '@/lib/generalFunc';
import UploadPreSigned from './UploadPreSigned';
import DeletePopUp2 from "@component/comp/DeletePopUp2";
import { AiTwotoneDelete } from "react-icons/ai";
import { getMedia } from '@/lib/fetchTypes';

type mainHeader = {
    input: inputType
}

export default function SelectImage({ input }: mainHeader) {
    const subject = 'image';

    const { saved, file, setFile, setMsg, msg, setSelect } = React.useContext(InputContext);
    const [imageObj, setImageObj] = React.useState<inputType | null>(null)
    const [deleteUnit, setDeleteUnit] = React.useState<inputType | null>(null);
    const [popup, setPopup] = React.useState<boolean>(false);
    const show = input.name === subject ? true : false;

    React.useMemo(async () => {
        if (input.name === subject) {
            const body = await getMedia(input.s3Key as string);
            if (body) {
                const { url, Key } = body;
                const refreshInput = { ...input, url, s3Key: Key }
                const freezeIn = inputFreeze(refreshInput);
                setImageObj(freezeIn);
            } else {
                setImageObj(input)
            }
        }
    }, [input]);


    const container = show ? "mx-auto flex flex-col flex-1 gap-2 lg:container border border-2 shadow-lg shadow-orange-600 w-full lg:w-full  cursor-pointer relative" : "hidden";

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!popup) return setPopup(true)
        setSelect(null)
        return
    }

    // console.log("SelectImageObj", imageObj)

    return (
        <div className={container}>
            <SavedMsg saved={saved} />
            <UploadPreSigned
                imageObj={imageObj}
                setImageObj={setImageObj}
                show={show}

            />
            {popup && <DeletePopUp2 popup={popup} setPopup={setPopup} input={imageObj} />}
            {!popup &&
                <AiTwotoneDelete onClick={handleDelete}
                    className="text-xl absolute right-3 top-2 bg-orange-800"

                />
            }
        </div>

    )
}