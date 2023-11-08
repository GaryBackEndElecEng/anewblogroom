import React from 'react';
import styles from "./header.module.css";
import Login from "@component/comp/Login";

export default function NeedRegister() {
    const showRef = React.useRef(null);
    const [show, setShow] = React.useState<boolean>(false);
    const [show1, setShow1] = React.useState<boolean>(false);
    const [remove, setRemove] = React.useState<boolean>(false);
    const display = show ? (styles.showNeed) : styles.hideNeed;

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0];
            setShow(entry.isIntersecting);
        }, { threshold: 1 })
        if (!showRef.current) return
        observer.observe(showRef.current);
    });

    React.useEffect(() => {
        if (!show) {
            setShow1(false);
            setRemove(false);
        }
        if (show) {
            //activating Show
            setTimeout(() => {
                setShow1(true);
            }, 4200);
        }
        if (show1) {
            //activating hid
            setTimeout(() => {
                //removing ele(s)
                setRemove(true);
            }, 4200);
        }
    }, [show, remove, show1])

    return (

        <div className='w-full relative flex flex-col items-center justify-center py-2 h-[26vh] sm:h-[20vh] lg:h-[15vh] overflow-y-hidden' ref={showRef}>
            <blockquote className={display}>
                <p className="text-center text slate-200 mr-1">
                    <q> All you need is an email and a name, nothing more.</q>

                </p>
                <Login />
            </blockquote>
        </div>

    )
}
