import React from 'react';
import { likefileType, likepostType, arrLikeType } from "@lib/Types";

type countArrType = {
    name: string,
    count: number
}
type mainFLikeType = {
    filelikes: likefileType[]
}
type mainPLikeType = {
    postlikes: likepostType[]
}
export function CalcFLike({ filelikes }: mainFLikeType) {
    const [countArr, setCountArr] = React.useState<countArrType[]>([])

    React.useEffect(() => {
        if (filelikes && filelikes.length > 0) {
            let arr: countArrType[] = []
            arrLikeType.map((name) => {
                let likes = filelikes.filter((like) => (like.name === name.name))
                let count: number = likes.length
                arr.push({ name: name.name, count: count })
            });
            setCountArr(arr)
        }
    }, [filelikes])
    return (
        <div className="col-span-1 mx-auto my-2">
            {filelikes &&

                <ul>
                    {countArr &&
                        countArr.map((obj, index) => (
                            <li key={index}>
                                <span><span className="text-red-300">N:</span>{obj.name}</span>
                                <span><span className="text-red-300">Cnt:</span>{obj.count}</span>
                            </li>
                        ))
                    }
                </ul>

            }
        </div>
    )
}
export function CalcPLike({ postlikes }: mainPLikeType) {
    const [countArr, setCountArr] = React.useState<countArrType[]>([])

    React.useEffect(() => {
        if (postlikes && postlikes.length > 0) {
            let arr: countArrType[] = []
            arrLikeType.map((name) => {
                let likes = postlikes.filter((like) => (like.name === name.name))
                let count: number = likes.length
                arr.push({ name: name.name, count: count })
            });
            setCountArr(arr)
        }
    }, [postlikes])
    return (
        <div className="col-span-1 mx-auto my-2">
            {postlikes &&
                <ul>
                    {countArr &&
                        countArr.map((obj, index) => (
                            <li key={index}>
                                <span><span className="text-red-300">N:</span>{obj.name}</span>
                                <span><span className="text-red-300">Cnt:</span>{obj.count}</span>
                            </li>
                        ))
                    }
                </ul>
            }
        </div>
    )
}
