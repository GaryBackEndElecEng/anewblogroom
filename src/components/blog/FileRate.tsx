"use client";
import React from 'react';
import styles from "@component/posts/posts.module.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';
import { fileType, ratefileType } from '@/lib/Types';
import { GeneralContext } from '../context/GeneralContextProvider';
import { sendFileRate } from '@/lib/fetchTypes';
import GenStars from "@component/comp/GenStars";


//make line of switches for likes and dislikes, then add it to files=> DO THE SAME FOR POSTS

type mainIconType = {
    id: number,
    name: string,
    icon: React.ReactNode,
    class: string

}
type mainFileLikeType = {
    file: fileType,

}
export default function FileRate({ file }: mainFileLikeType) {
    const rateNumArr: number[] = [0, 1, 2, 3, 4, 5]
    const { setFileRates, fileRates } = React.useContext(GeneralContext);
    const [rate, setRate] = React.useState<number>(0);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tempFileRate: ratefileType = { rate: rate, fileId: file.id as string }
        const updateFileRate = await sendFileRate(tempFileRate);
        if (!updateFileRate) return
        setFileRates([...fileRates, updateFileRate])

    }
    return (
        <div className="lg:container mx-auto">
            <div className="flex flex-col items-center justify-center border border-emerald-700 rounded-xl h-[75px] gap-1 mb-0 w-full">
                <form action="" className="w-full p-1  shadow shadow-slate-300 mx-auto flex flex-row gap-4 justify-center items-center bg-slate-500 " onSubmit={handleSubmit}>
                    <select
                        className="p-1 border border-emerald-500 rounded-lg bg-slate-600 text-white"
                        value={String(rate)}
                        onChange={(e) => setRate(parseInt(e.target.value))}
                    >
                        {rateNumArr.map((num: number) => (
                            <React.Fragment key={num + 1}>
                                <option value={num}>{num}</option>
                            </React.Fragment>
                        ))}
                    </select>
                    <button className={styles.buttonsm} type="submit">send</button>
                </form>
                <GenStars rate={rate} />
            </div>

        </div>
    )
}
