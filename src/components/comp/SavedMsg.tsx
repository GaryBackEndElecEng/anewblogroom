import React from 'react'
import type { msgType } from "@lib/Types";

type mainType = {
    saved: msgType
}
export default function SavedMsg({ saved }: mainType) {
    const [isOn, setIsOn] = React.useState<boolean>(true);

    setTimeout(() => { setIsOn(false) }, 3000);

    const comp = isOn && (
        saved && saved.loaded ? (
            <h3 className="text-center font-bold my-10 undefined underline-offset-8 text-green-900 shadow rounded-lg p-2 shadow-green-400">{saved.msg}</h3>
        ) : (
            <h3 className="text-center font-bold my-10 undefined underline-offset-8 text-orange-900 shadow rounded-lg p-2 shadow-red-400">{saved.msg}</h3>
        )
    )

    return (
        <div className="absolute -top-[100%] inset-mx-0 w-3/4 sm:w-1/2">

            {comp}
        </div>

    )
}
