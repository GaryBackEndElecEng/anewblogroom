"use client"
import React from 'react';
import { inputType, mediaType } from '@/lib/Types';
import { v4 as uuidv4 } from "uuid";
import { InputContext } from "@context/InputTypeProvider";
import { Button } from "@chakra-ui/react"
import { saveToStorage } from "@lib/storePullLocStorage";
import Image from 'next/image';
import { updateInput } from '@/lib/fetchTypes';
import { updatefileInput } from '@/lib/generalFunc';

type mediaInputType = {
    imageObj: inputType | null,
    setImageObj: React.Dispatch<React.SetStateAction<inputType | null>>,
    show: boolean
}
type getUrlType = {
    uploadUrl: string
    key: string,
    msg: string
}


export default function UploadPreSigned({ imageObj, setImageObj, show }: mediaInputType) {
    const { file, setSaved, setFile, setSelect } = React.useContext(InputContext);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [msg, setMsg] = React.useState<mediaType>({ loaded: false, message: "" });
    const [isUploading, setIsUploading] = React.useState<boolean>(false)
    const randNum = uuidv4().split("-")[0];
    const [imgObjUpdate, setImgObjUpdate] = React.useState<inputType | undefined>()

    React.useEffect(() => {
        if (imgObjUpdate) {
            setImageObj(imgObjUpdate)
        }
    }, [imgObjUpdate, setImageObj]);


    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!file) return
        if (!e.currentTarget.files || !imageObj) return
        const fileImg = e.currentTarget.files[0]
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)
        const imgInput = await uploadToS3(fileImg, imageObj);
        if (!imgInput) return
        setImageObj(imgInput)
        setSelect(null)
        setTempImg(null)
        if (!file) return

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        //THIS GETS PRESIGNED URL FOR UPLOADS then uploads to s3 directly FROM @lib/s3ApiComponents
        if (!file) return
        setIsUploading(true)

        if (file && imgObjUpdate) {
            const update_input = await updateInput(imgObjUpdate)
            if (update_input) {
                const modFile = updatefileInput(file, update_input)
                setFile(modFile)
                //save to storage
                saveToStorage(modFile);
                setTempImg(null)
                setSaved({ loaded: true, msg: "saved" });
            }
        } else {
            setMsg({ loaded: false, message: "only image files are excepted, try again" })
        }
        setIsUploading(false);

    }


    const msgStyle = "text text-center top-0 inset-0 bg-inherit text-xl";
    const imageStyle = " mx-auto"
    return (
        <div className="container mx-auto w-full lg:w-full relative overflow-hidden">
            {msg.message && <div className={`${msgStyle} ${msg.loaded ? "text-white" : " text-red-800"} bg-white`}>{msg.message}</div>}
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col mx-auto  my-2 z-1">
                <input
                    hidden={tempImg ? true : false}
                    id={(imageObj && imageObj.id) ? String(imageObj.id) : "image id"}
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />
                {tempImg ?

                    <Button isLoading={isUploading} colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isUploading}  >up load</Button>
                    :
                    <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
                }
            </form>
            {show &&
                <div className="container  w-full mx-auto flex flex-col flex-1 items-center justify-center  z-1000">
                    {(tempImg) &&
                        <Image src={tempImg}
                            alt={`${randNum}-image`}
                            width={600}
                            height={400}
                            className={imageStyle}
                        />
                    }
                    {(imageObj && imageObj.url) &&
                        <>
                            <Image src={imageObj.url as string}
                                id={String(imageObj.id)}
                                alt={`${imageObj.content}-${file && file.name} image`}
                                width={600}
                                height={400}
                                className={imageStyle}
                            />
                        </>
                    }
                </div>
            }
        </div>
    )
}

export async function uploadToS3(imgFile: File, imageObj: inputType): Promise<inputType | undefined> {
    const formdata = new FormData();
    if (!imgFile) return undefined
    const ext = imgFile.type.split("/")[1]
    const genKey = uuidv4().split("-")[0]
    const Key = `${imgFile?.name.split(".")[0]}-${genKey}-${imageObj.s3Key}.${ext}`
    formdata.set("file", imgFile);
    formdata.set("Key", Key);


    try {
        const res = await fetch("/api/uploadImage", {
            method: "PUT",
            body: formdata
        });
        if (res.ok) {
            return { ...imageObj, s3Key: Key }
        }

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}