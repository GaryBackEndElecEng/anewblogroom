"use client"
import React from 'react';
import { GeneralContext } from "@context/GeneralContextProvider"

export default function GetError() {
    const { getError } = React.useContext(GeneralContext);
    return (
        <>
            {getError &&
                <div className="absolute top-24 sm:right-10 right-2 p-1 px-3 rounded-xl shadow shadow-slate-200">
                    <h2 className="text-font-bold text-2xl text-slate-200 bg-[rgba(0,0,0,0.8)]">

                        {getError}
                    </h2>
                </div>
            }
        </>
    )
}
