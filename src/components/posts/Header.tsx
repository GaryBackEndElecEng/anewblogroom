import React from 'react';
import styles from "./posts.module.css";

export default function Header() {
    const image = "/images/postHeader.png";
    const [hide, setHide] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);


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
        <div
            style={{ backgroundImage: `url(${image})` }}
            className={styles.postHeader}
        >
            <p className={pStyle}>
                A room for bloggers to interact.
            </p>
            <p className={pStyle}>
                A room for bloggers to pull viewers.
            </p>
            <p className={pStyle}>
                A room for bloggers to test the changing markets.
            </p>
        </div>
    )
}
