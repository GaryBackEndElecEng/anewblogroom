"use client";
import React from 'react';
import styles from "@component/header/client.module.css"
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { GeneralContext } from "@context/GeneralContextProvider";

export default function HomeLinksHeader() {
    const url = "/images/gb_logo.png";
    const { user } = React.useContext(GeneralContext);
    const pathname = usePathname();
    const [show, setShow] = React.useState<boolean>(false);
    const [img, setImg] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!(user && user.image && user.imgKey)) return;
        setImg(user.image);
    }, [user]);

    React.useEffect(() => {
        if (!pathname) return setShow(false)
        const ArrUrl = pathname.split("/");
        const len = ArrUrl.length;
        const name = ArrUrl[len - 1];
        const isDash = name === "dashboard" ? true : false
        setShow(isDash)

    }, [pathname, setShow]);

    // console.log(turnOn)

    const container = `${styles.containerImage} lg:container mx-auto mb-2 p-1 pb-2`
    const sectionStyle = "flex flex-col justify-center items-center mx-auto sm:h-[36vh] h-[30vh] lg:h-[40vh] relative "
    return (
        <React.Fragment>
            {show &&
                <div className={container}>
                    <section className={sectionStyle}>
                        <div className={styles.ImgContainerDash}>
                            <Image src={img ? img : url} width={75} height={75} alt="www.garymasterconnect.com"
                                className={`${styles.dashImg} bg-slate-900 rounded-full p-2 border border-white `}
                            />
                        </div>

                    </section>
                </div>
            }

        </React.Fragment>
    )
}
