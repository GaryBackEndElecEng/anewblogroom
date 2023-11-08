"use client";
import React from 'react';
import styles from "@component/blog/allBlogs.module.css";
import { usePathname } from "next/navigation";

export default function BlogHeader() {
    const pathname = usePathname();
    const image = "/images/postHeader.png";
    const [hide, setHide] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);
    const [showHeader, setShowHeader] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (!pathname) return;
        const uriArr = pathname.split("/");
        const len = uriArr.length;
        const isBlog = uriArr[len - 1] === "makeapost" ? true : false;
        setShowHeader(isBlog)
    }, [pathname]);

    React.useEffect(() => {
        if (!show) {
            setShow(true)
        }
        if (show) {
            setTimeout(() => { setHide(true) }, 6300);
        }
    }, [hide, show]);

    const showStyle = `${styles.statement} text-slate-200 text-xl sm:text-3xl lg:text-4xl mx-auto`
    const hideStyle = `${styles.statementHide} text-slate-200 text-xl sm:text-3xl lg:text-4xl mx-auto`
    const pStyle = show && !hide ? showStyle : hideStyle

    return (
        <React.Fragment>
            {showHeader &&
                <div
                    style={{ backgroundImage: `url(${image})` }}
                    className={styles.postHeader}
                >
                    <p className={pStyle}>
                        Welcome to the Post Room.
                    </p>
                    <p className={pStyle}>
                        Make a post to highlight your needs.
                    </p>
                    <p className={pStyle}>
                        Please ensure that your post is respectful,,,Please.
                    </p>
                </div>
            }
        </React.Fragment>
    )
}
