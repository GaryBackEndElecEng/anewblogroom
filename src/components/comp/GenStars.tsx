import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import styles from "@component/posts/posts.module.css";

export default function GenStars({ rate }: { rate: number }) {
    let arr: number[] = [1, 2, 3, 4, 5]
    const rateArr = [
        { id: 1, name: "full", icon: <StarIcon sx={{ color: "gold" }} /> },
        { id: 2, name: "half", icon: <StarHalfIcon sx={{ color: "gold" }} /> },
        { id: 3, name: "emty", icon: <StarOutlineIcon sx={{ color: "gold" }} /> },
    ]

    return (

        <div className={`flex flex-row justify-center items-center gap-1 h-[30px] ${styles.genstars}`} >
            <React.Fragment>
                {rate &&
                    arr.slice(0, rate).map(num => (
                        <React.Fragment key={num}>
                            {rateArr[0].icon}
                        </React.Fragment>
                    ))
                }
                {rate &&
                    arr.slice(rate, arr.length).map(num => (
                        <React.Fragment key={num}>
                            {rateArr[2].icon}
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
        </div>
    )


}