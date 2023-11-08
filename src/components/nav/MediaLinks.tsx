"use client";
import React from 'react'
import { GeneralContext } from '../context/GeneralContextProvider';
import { FaGithub, FaLaptop, } from 'react-icons/fa';
import { ImFacebook2 } from "react-icons/im";

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { genInfoType } from "@lib/Types";
import styles from "@nav/nav.module.css";

interface mediaType extends genInfoType {
    icon: React.ReactNode | undefined
}

const arrMedia = [
    { name: "facebook", icon: <ImFacebook2 /> },
    { name: "linkedln", icon: <LinkedInIcon sx={{ position: "relative", top: "-8px", padding: "0px", m: 0 }} /> },
    { name: "masterconnect", icon: <FaLaptop /> },
    { name: "masterultils", icon: <FaLaptop /> },
    { name: "github", icon: <FaGithub /> },

]

export default function MediaLinks() {
    const { genInfo } = React.useContext(GeneralContext);
    const [genInfoPlus, setGenInfoPlus] = React.useState<(mediaType)[]>([]);

    React.useEffect(() => {
        if (!genInfo) return
        const convergeInfo = genInfo.map((info, index) => {
            const media = arrMedia.find(med => (med.name === info.name));

            if (media && media.icon) {
                return {
                    ...info, icon: media.icon
                }
            } else {
                return { ...info, icon: undefined }
            }
        });
        setGenInfoPlus(convergeInfo);
    }, [genInfo]);

    const media = "flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-xl lg:text-2xl"
    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, link: string) => {
        if (window) {
            window.open(link, "blank")
        }
    }

    return (
        <div className={media}>
            {genInfoPlus && genInfoPlus.map((info, index) => (
                <div key={index} className={` relative`}>

                    <div onClick={(e) => handleLink(e, info.url)} className={`${styles.linkText} text-white/90  hover:text-red-300 rounded-full`} data-word={info.name} >
                        {info.icon}
                    </div>
                </div>
            ))

            }
        </div>
    )
}
