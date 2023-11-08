"use client";
import React from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider'
import { userType, mainPageHit, fileType, } from '@/lib/Types';


type mainPageHitType = {
    files: fileType[] | []
}
export function filterUserPageHit(files: fileType[], pageHits: mainPageHit[]) {

    let arrAccum: mainPageHit[] = [];
    let count: number = 0;
    let name: string = "";
    let date: Date;
    let username = "";
    pageHits.filter(page => (page.name !== "none")).
        forEach((page, index) => {
            if (!page || !(files && files.length)) return
            let pFile = files.
                find(file => (page.page.endsWith(file.id)));
            if (!pFile) return
            count = page.count ? page.count : 0
            name = pFile.name
            username = page.name
            date = new Date(page.date as Date)
            arrAccum.push({ id: page.id, page: name, count: count, date: date, name: username })
        });
    return arrAccum
}
export function totalHits(pageHits: mainPageHit[], user: userType) {
    if (!user) return 0
    const accum = pageHits.
        filter(page => (page.name === user.name)).
        reduce((a, b) => (a + (b.count ? b.count : 0)), 0);
    return accum
}

export default function UserPageHit({ files }: mainPageHitType) {
    const { pageHitArr, setPageHitArr, user } = React.useContext(GeneralContext);
    const [userPageHits, setUserPageHits] = React.useState<mainPageHit[]>([]);
    const [total, setTotal] = React.useState<number>(0)

    React.useEffect(() => {
        if (!user) return
        const usersHits = filterUserPageHit(files, pageHitArr);
        setUserPageHits(usersHits);
        let sum = totalHits(pageHitArr, user);
        setTotal(sum);
    }, [files, pageHitArr]);


    const singleCol = "mx-auto flex flex-row flex-wrap justify-center items-start text-xs mt-4 gap-1";
    const symColor = "text-slate-900 font-bold mx-1 text-md"
    return (
        <div className="lg:container mx-auto px-2 my-1">
            <h2 className="text-center font-bold underline underline-offset-[0.5rem]">page hits</h2>
            <h3 className="text-center text-xl font-bold my-1 mb-2 mx-auto">Total hits: {total} hits</h3>
            {
                userPageHits && userPageHits?.length!! ?
                    userPageHits.map((page, index) => (
                        <div className={singleCol} key={index}>
                            <h3 className="text-center"><span className={symColor}>PG:</span>{page.page}</h3>
                            <h3 className="text-center"><span className={symColor}>#:</span>{page.count}</h3>

                        </div>
                    ))
                    :
                    (<div className="flex flex-col justify-center items-center">
                        <h3 className="text-center mx-auto">No hits yet</h3>
                    </div>)
            }

        </div>
    )
}
