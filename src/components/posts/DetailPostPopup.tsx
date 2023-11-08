import React from 'react'
import { useRouter } from "next/navigation";

type popupType = {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>,
    popup: boolean,
    link: string | null
}
export default function DetailPostPopup({ setPopup, popup, link }: popupType) {
    const router = useRouter();
    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!link) return
        router.push(link);
        setPopup(false);
    }

    return (
        <React.Fragment>
            {(popup && link) &&
                <div className="absolute inset-0 w-full z-1000">
                    <div className="flex flex-row flex-wrap items-center justify-center gap-3 p-1 bg-[rgba(0,0,0,0.7)] h-[20vh] ">
                        <button className="buttonsm" onClick={(e) => handleLink(e)}>view blog</button>
                        <button className="buttonsm" onClick={() => setPopup(false)}>not now</button>
                    </div>


                </div>
            }
        </React.Fragment>
    )
}
