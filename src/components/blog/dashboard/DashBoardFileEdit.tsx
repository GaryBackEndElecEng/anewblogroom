"use client";
import React from 'react';
import Title from "@/components/comp/Title";
import Heading from "@/components/comp/Heading";
import SubHeading from "@/components/comp/SubHeading";
import Section from "@/components/comp/Section";
import Summary from "@/components/comp/Summary";
import Conclusion from "@/components/comp/Conclusion";
import HLink from '@component/comp/HLink';
import Question from "@/components/comp/Question";
import DashBoardFile from "@/components/blog/dashboard/DashBoardFile";
import SelectImage from "@component/comp/SelectImage";
import { InputContext } from '@context/InputTypeProvider';
import { gen_uuid } from "@lib/codeGenerator";
import { fileType, } from '@/lib/Types';
import SavedMsg from "@component/comp/SavedMsg";
import Button from "@component/comp/Button";
import Link from "next/link";
import { selectControl } from "@lib/generalFunc";
import { GeneralContext } from '@context/GeneralContextProvider';
import Image from 'next/image';
import ListComp from '@component/comp/ListComp';


type mainTemplateType = {
    recfile: fileType,
}

export default function DashBoardFileEdit({ recfile }: mainTemplateType) {
    const getCode = gen_uuid();
    const { setFile, file, saved, setSaved, select } = React.useContext(InputContext);
    const { user, account } = React.useContext(GeneralContext);

    React.useEffect(() => { setFile(recfile) }, [setFile, recfile]);


    const container = "flex flex-col items-center justify-start mx-auto gap-2 my-0";
    const subContainer = "flex flex-col items-center justify-start mx-auto gap-1 w-full lg:w-3/4";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";
    const profilePic = "rounded-full p-1 shadow shadow-white border border-orange-300"

    return (

        <div className={container}>
            <div className={subContainer}>
                <div className="flex flex-row flex-wrap my-2 gap-3 justify-center items-center">
                    <h3 className="text-center font-bold my-3">
                        {user?.name} &#8217;s Blog
                    </h3>
                    {(user && user.image) ?
                        (<Image src={user.image} height={80} width={80} alt={`${user.name}`}
                            className={profilePic}
                        />)
                        :
                        (<Image src={"/images/gb_logo"} height={80} width={80} alt={`www.garymaster.com www.masterconnect.ca`}
                            className={profilePic}
                        />)}
                </div>
                <DashBoardFile
                    saved={saved}
                    setSaved={setSaved}
                    user={user}
                    file={file && file}
                />

                <div className="border-2 border-white h-[5px] w-full mt-2" />

            </div>
            <div className={subContainer}>
                <SavedMsg saved={saved} />
                {file && file.inputTypes && file.inputTypes.length!! &&
                    file.inputTypes.map((input, index) => {
                        let check: boolean = selectControl(input);
                        if (!check) return
                        return (
                            <React.Fragment key={index}>
                                <Title input={input} />
                                <SelectImage input={input} />
                                <Heading input={input} />
                                <Summary input={input} />
                                <SubHeading input={input} />
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
            <Link href={"/blog"} className={"mb-4"}>
                <Button color={"emerald"} border={true} > go to posts</Button>
            </Link>
        </div>

    )
}
