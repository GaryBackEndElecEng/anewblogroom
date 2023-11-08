import { GeneralContext } from '@/components/context/GeneralContextProvider'
import React from 'react';
import { likefileType, ratepostType, ratefileType, likepostType, postType, fileType, userType, arrLikeType } from "@lib/Types";
import { CalcFileRate, CalcPostRate } from "@component/blog/dashboard/CalcRate"
import { CalcFLike, CalcPLike } from "@component/blog/dashboard/CalcLike"


type mainLikeRateType = {
    userPosts: postType[] | null,
    userFiles: fileType[] | null,

}
export default function LikesAndRates({ userPosts, userFiles }: mainLikeRateType) {







    return (
        <div className="mx-auto px-2">

        </div>
    )
}
