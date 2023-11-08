import { GeneralContext } from '@/components/context/GeneralContextProvider'
import React from 'react';
import { likefileType, ratefileType, fileType, } from "@lib/Types";
import { CalcFileRate, } from "@component/blog/dashboard/CalcRate"
import { CalcFLike, } from "@component/blog/dashboard/CalcLike"

type mainLikeRateType = {
    userFile: fileType | null,

}
export default function FileLikesRates({ userFile }: mainLikeRateType) {
    // const { fileLikes, fileRates } = React.useContext(GeneralContext);


    return (
        <div className="mx-auto px-2">
            <div className="grid grid-cols-2 mx-auto gap-3 sm:gap-1">
                {userFile && userFile.rates &&
                    <div>
                        <h3 className="text-xl text-center mb-2 underline underline-offset-6">{userFile.name}-Rates</h3>
                        <CalcFileRate file={userFile} filerates={userFile.rates} />
                    </div>
                }

                {userFile && userFile.likes &&
                    <div>
                        <h3 className="text-xl text-center mb-2 underline underline-offset-6">{userFile.name}-Likes</h3>
                        <CalcFLike filelikes={userFile.likes} />
                    </div>
                }
            </div>
        </div>
    )
}