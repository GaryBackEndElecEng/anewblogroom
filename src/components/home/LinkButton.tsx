import Link from 'next/link'
import React from 'react'
import Button from "@component/comp/Button";
import styles from "./home.module.css"
import type { dataType, userAccountType } from "@lib/Types";


type maindataType = {
    dataLink: dataType,
    account: userAccountType | undefined
}

export default function LinkButton({ dataLink, account }: maindataType) {

    const linkRef = React.useRef(null);
    const [show, setShow] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<boolean>(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0]
            if (account && account.loaded) {
                setShow(true);
                setTitle(true);
            } else {
                setShow(entry.isIntersecting);
                setTimeout(() => { setTitle(entry.isIntersecting) }, 1000)
            }


        }, { threshold: 0.8 });
        if (!linkRef.current) return
        observer.observe(linkRef.current)
    }, [setShow, linkRef, account]);

    const circLinks = "p-1 px-2 w-[100px] h-[100px] rounded-full border border-orange-400 shadow shadow-orange-800 m-auto flex flex-col items-center justify-center hover:shadow-emerald-300 hover:shadow-md";


    return (
        <div className={show ? styles.link : styles.linkHide}
        >
            <h3 className={title ? `${styles.title} prose-lg text-slate-200` : styles.titleHide}>{dataLink.desc}</h3>
            <Link href={dataLink.link} className={`${circLinks} bg-slate-400`} ref={linkRef}>
                <Button border={true} color={"emerald"}>{dataLink.name} </Button>
            </Link>
        </div>
    )
}
