"use client"
import React from 'react';
import { inputType, fileType, mediaType } from '@/lib/Types';
import { v4 as uuidv4 } from "uuid";
import { InputContext } from "@context/InputTypeProvider";
import axios from "axios";
import { Button } from "@chakra-ui/react"
import { saveToStorage, } from "@lib/storePullLocStorage";
import { fileUploadToS3 } from "@lib/s3ApiComponents";
import Image from 'next/image';
import { saveFile } from '@/lib/fetchTypes';


type mediaInputType = {
    imageObj: inputType,
    setImageObj: React.Dispatch<React.SetStateAction<inputType | null>>
}
type getUrlType = {
    uploadUrl: string
    key: string,
    msg: string
}


export default function FileImage() {
    const { file, setFile } = React.useContext(InputContext);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [msg, setMsg] = React.useState<mediaType>({ loaded: false, message: "" });
    const [isUploading, setIsUploading] = React.useState<boolean>(false)
    const [imgFile, setImgFile] = React.useState<File>({} as File)



    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.currentTarget.files || !file) return
        const fileImg = e.currentTarget.files[0]
        const key = await uploadToS3(fileImg, file.name)
        if (!key) return
        setFile({ ...file, imageKey: key as string })
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        //THIS GETS PRESIGNED URL FOR UPLOADS then uploads to s3 directly FROM @lib/s3ApiComponents
        if (!file) return


        if (file) {

            const savedFile = await saveFile(file);//saving/getting file.imageUrl
            if (!savedFile) return
            setFile(savedFile);
            //save to storage
            saveToStorage(savedFile);
            setTempImg(null)
        } else {
            setMsg({ loaded: false, message: "only image files are excepted, try again" })
        }
        setIsUploading(false);

    }
    const msgStyle = "text text-center top-0 inset-0 bg-inherit text-xl";

    return (
        <div className="container mx-auto w-full lg:w-3/4 relative overflow-hidden">
            {msg.message && <div className={`${msgStyle} ${msg.loaded ? "text-white" : " text-red-800"} bg-white`}>{msg.message}</div>}
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col mx-auto  my-2 z-1">
                <input
                    hidden={tempImg ? true : false}
                    id={(file && file.id) ? file.id as string : "file cover image"}
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />
                {tempImg ?

                    <Button isLoading={isUploading} colorScheme="teal" variant="ghost" size="medium" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isUploading}  >up load</Button>
                    :
                    <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="medium" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
                }
            </form>
            <div className="container image w-full mx-auto flex flex-col items-center justify-center  z-1000">
                {
                    (tempImg && file && !file.imageUrl) ?
                        <Image src={tempImg}
                            alt={`${file ? file.title : "cover image"}`}
                            width={600}
                            height={400}
                            className={"image m-auto"}
                        />
                        :
                        (file && file.imageUrl && file.imageUrl.startsWith("https") &&
                            <Image
                                id={file.id}
                                src={file && file.imageUrl as string}
                                alt={`main cover image`}
                                width={600}
                                height={400}
                                className={"image m-auto"}
                            />
                        )
                }
            </div>
        </div>
    )
}

export async function uploadToS3(file: File, filename: string) {
    if (!file || !filename) return
    const formdata = new FormData();
    const genKey = uuidv4().split("-")[0]
    const Key = `${file?.name.split(".")[0]}-${genKey}-${filename}-${file.name}`
    formdata.set("file", file);
    formdata.set("Key", Key);


    try {
        const res = await fetch("/api/uploadImage", {
            method: "PUT",
            body: formdata
        });
        if (res.ok) {
            return Key
        }


    } catch (error) {
        throw new Error("did not get urlkey")
    }
}