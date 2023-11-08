"use client"
import { GeneralContext } from '@/components/context/GeneralContextProvider'
import { InputContext } from '@/components/context/InputTypeProvider'
import { getLinks, getuserFiles } from '@/lib/fetchTypes'
import { fileType, inputType, linkType } from '@lib/Types'
import React from 'react'
type main_Type = {
    files: fileType[]
}
export default function GetLinkHits({ files }: main_Type) {
    const { getlinks, setGetlinks } = React.useContext(InputContext);
    const { user } = React.useContext(GeneralContext);
    const [userLinks, setUserLinks] = React.useState<linkType[]>([]);
    const [getUserFilesAndInput, setGetUserFilesAndInput] = React.useState<fileType[]>([]);

    React.useMemo(async () => {
        const links = await getLinks()
        if (!links) return
        setGetlinks(links)
    }, [setGetlinks]);

    React.useMemo(async () => {
        if (user && user.id) {
            const getUserFilesandinputs = await getuserFiles(user.id);
            if (!getUserFilesandinputs) return
            setGetUserFilesAndInput(getUserFilesandinputs)
        }
    }, [user]);

    React.useEffect(() => {
        if (!getlinks) return
        if (!files) return

        let arr: linkType[] = []
        getlinks.map((link, index) => {
            getUserFilesAndInput.forEach((file, ind) => {
                let check = file.inputTypes.find(input => (input.id === link.inputId));
                if (check) {
                    arr.push(link)

                }
            });
        });
        setUserLinks(arr);
    }, [getUserFilesAndInput, getlinks]);

    return (
        <div className="mx-auto container">
            <h3 className="font-bold text-center mb-3 underline underline-offset-8">links</h3>
            <ul className="mx-auto my-2 p1 flexcol gap-2">
                {userLinks && userLinks.map((link, index) => (
                    <li key={index} className="text-sm">link:{link.url}:#{link.count}</li>
                ))}
            </ul>
        </div>
    )
}
