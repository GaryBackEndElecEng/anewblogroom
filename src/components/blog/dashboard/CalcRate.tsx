import React from 'react'
import type { fileType, postType, ratefileType, ratepostType } from "@lib/Types";


type mainFType = {
    file: fileType | null,
    filerates: ratefileType[],
}
type mainPType = {
    post: postType | null,
    postrates: ratepostType[],
}
export function CalcFileRate({ file, filerates }: mainFType) {

    const filerateAvg = React.useCallback(() => {
        if (!filerates || (filerates.length === 0)) return
        const avgRaw = (filerates.reduce((a, b) => (a + b.rate), 0)) / filerates.length;
        return Math.ceil(avgRaw);
    }, [filerates])

    return (
        <React.Fragment>
            {file && <div className="col-span-1 mx-auto">

                <h5 className="text-center text-md"><span className="text-red-300">count:</span>{filerates.length}</h5>
                <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                    <h5 className="text-center text-md"><span className="text-red-300">count:</span> {filerates.length}</h5>
                    <h5 className="text-center text-md"><span className="text-red-300">avg:</span> {filerateAvg() && filerateAvg()}</h5>
                </div>
            </div>}
        </React.Fragment>
    )
}
export function CalcPostRate({ post, postrates }: mainPType) {

    const postrateAvg = React.useCallback(() => {
        if (!postrates || (postrates.length === 0)) return
        const avgRaw = (postrates.reduce((a, b) => (a + b.rate), 0)) / postrates.length;
        return Math.ceil(avgRaw);
    }, [postrates])

    return (
        <React.Fragment>
            {post && <div className="col-span-1 mx-auto">

                <h5 className="text-center text-md"><span className="text-red-300">count:</span> {postrates.length}</h5>
                <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                    <h5 className="text-center text-md"><span className="text-red-300">count:</span> {postrates.length}</h5>
                    <h5 className="text-center text-md"><span className="text-red-300">avg:</span> {postrateAvg() && postrateAvg()}</h5>
                </div>
            </div>}
        </React.Fragment>
    )
}
