import { inputType, } from '@/lib/Types'
import { removeComponent } from '@/lib/generalFunc'
import React from 'react'
import { InputContext } from '@context/InputTypeProvider';
import { deleteFile } from "@lib/fetchTypes";
import { removeFile, removeUserFile } from "@lib/generalFunc";

type mainType = {
    openDelete: { loaded: boolean, id: string | null },
    setOpenDelete: React.Dispatch<React.SetStateAction<{ loaded: boolean, id: string | null }>>,
    fileID: string | null,

}
const DeleteFilePopup = ({ openDelete, setOpenDelete, fileID }: mainType) => {
    const { setMsg, allFiles, setAllFiles, setFile, userFiles, setUserFiles } = React.useContext(InputContext);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!fileID) return setMsg({ loaded: false, msg: "not deleted- no file" })
        const retFile = await deleteFile(fileID);
        if (!retFile) return setMsg({ loaded: false, msg: "file not deleted" });
        const newFiles = removeFile(allFiles, retFile.id);
        if (!newFiles) return
        setAllFiles(newFiles)
        const redUserFiles = removeUserFile(userFiles, retFile.id);
        if (!redUserFiles) return
        setUserFiles(redUserFiles);
        setMsg({ loaded: true, msg: `${retFile.name} has been deleted` });
        // console.log(deleteUnit)
        setOpenDelete({ loaded: false, id: null });
        return setTimeout(() => { setMsg({ loaded: false, msg: "" }); }, 2500);

    }

    const button = " flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 bg-black text-white z-1000";
    return (
        <div className={(openDelete.loaded && openDelete.id === fileID) ? "absolute inset-0 w-full h-[20vh] flex flex-col mx-auto justify-evenly items-center bg-[rgba(0,0,0,0.9)]" : "hidden"}>
            <h3 className="text-center w-full">Are you sure?</h3>
            <div className="flex flex-row gap-6 items-center justify-evenly">
                <button className={button} onClick={(e) => handleDelete(e)}>delete</button>
                <button className={button} onClick={() => setOpenDelete({ loaded: false, id: null })}>cancel</button>
            </div>
        </div>
    )
}

export default DeleteFilePopup