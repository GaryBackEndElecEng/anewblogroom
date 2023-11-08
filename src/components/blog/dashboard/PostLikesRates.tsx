// import { GeneralContext } from '@/components/context/GeneralContextProvider';
import React from 'react';
import { postType, } from "@lib/Types";
import { CalcPostRate } from "@component/blog/dashboard/CalcRate"
import { CalcPLike } from "@component/blog/dashboard/CalcLike"

type mainLikeRateType = {
    userPost: postType | null,

}
export default function LikesAndRates({ userPost }: mainLikeRateType) {
    // const { postLikes, postRates } = React.useContext(GeneralContext);


    return (
        <div className="mx-auto px-2">
            <div className="grid grid-cols-2 mx-auto gap-3 sm:gap-1">
                {userPost && userPost.rates &&
                    <div>
                        <h3 className="text-xl text-center mb-2 underline underline-offset-6">{userPost.name}-Rates</h3>
                        <CalcPostRate post={userPost} postrates={userPost.rates} />
                    </div>
                }
                {userPost && userPost.likes &&
                    <div>
                        <h3 className="text-xl text-center mb-2 underline underline-offset-6">{userPost.name}-Likes</h3>
                        <CalcPLike postlikes={userPost.likes} />
                    </div>
                }
            </div>
        </div>
    )
}