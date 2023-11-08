"use client"
import React from 'react';
import { Heading, Section, Summary, SubHeading, Conclusion, ImageJsx, FileContent, Question, HLink } from "@blogElement/elements";
import type { fetchSingleFileType, fetchSingleWrapType, msgType, userType, fileType } from "@lib/Types";
import { inputArr } from "@lib/Types";
import Button from '@component/comp/Button';
import Link from 'next/link';
import getFormattedDate from "@lib/getFormattedDate";
import Image from 'next/image';
import { InputContext } from '@context/InputTypeProvider';
import Published from "@component/comp/Published";
import ListComp from '@/components/comp/ListComp';


type mainBlogItemType = {
    get_file: fileType

}

export default function GenFileItem({ get_file }: mainBlogItemType) {
    const [getData, setGetData] = React.useState<fetchSingleFileType>({} as fetchSingleFileType);
    const { msg } = React.useContext(InputContext);
    const [published, setPublished] = React.useState<boolean>(false);
    const [staticFile, setStaticFile] = React.useState<fileType>({} as fileType)

    React.useEffect(() => { setStaticFile(get_file) }, [get_file, setStaticFile]);



    const container = "lg:container mx-auto flex flex-col items-center justify-center";
    const h2 = "mx-auto text-center text-2xl underline underline-offset-8";
    const h1 = "mx-auto text-center text-3xl underline underline-offset-8";
    const msg_ = "absolute top-[5%] inset-y-0 w-full lg:w-1/4 h-[10vh] flex flex-col justify-center items-center";
    const msgFalse = "text-center text-red-800 font-bold prose prose-xl text-xl m-auto";
    const msgTrue = "text-center text-white prose prose-xl font-bold text-xl m-auto";
    const flexrow = "mx-auto flex flex-row justify-start items-start gap-3";

    const dateToStr = get_file && get_file.date && getFormattedDate(get_file.date);
    // console.log(staticFile)

    return (
        <div className={container}>
            <div className="flex flex-col justify-start items-center">
                <div className={msg_}>
                    {msg.loaded ? (
                        <div className={msgTrue}>{msg.msg}</div>
                    ) : (<div className={msgFalse}>{msg.msg}</div>)}
                </div>

                <div className={flexrow}>
                    <h6 className="font-bold">{getData.filename}</h6>
                </div>
                <small className="font-bold">{dateToStr && dateToStr}</small>
            </div>
            <div className="mx-auto lg:container px-2 my-2 flex flex-col items-center">
                <FileContent file={staticFile} />
            </div>
            <div className="mx-auto ">
                <Published published={published} setPublished={setPublished} get_file={get_file} />
            </div>
            <details>
                <summary className="mb-4 mx-auto cursor-pointer text-2xl"> open body</summary>
                <div className="mx-auto lg:container">
                    {staticFile && staticFile.inputTypes?.length!! &&
                        staticFile.inputTypes.map((input, index) => {
                            const check = inputArr.find(name => (name === input.name)) ? true : false;
                            if (!(check && index)) return
                            return (
                                <React.Fragment key={index}>
                                    <Heading input={input} />
                                    <SubHeading input={input} />
                                    <ImageJsx input={input} />
                                    <Summary input={input} />
                                    <Section input={input} />
                                    <Conclusion input={input} />
                                    <Question input={input} />
                                    <HLink input={input} />
                                    <ListComp input={input} />
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </details>

        </div>
    )
}