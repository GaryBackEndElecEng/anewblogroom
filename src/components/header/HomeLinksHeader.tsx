"use client";
import React from 'react';
import styles from "./client.module.css"
import { GeneralContext } from '@context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { getUserMeta } from '@/lib/fetchTypes';

export default function HomeLinksHeader() {
    const { setGetError } = React.useContext(GeneralContext)
    const url = "/images/gb_logo.png";
    const pathname = usePathname();
    const { pageHit, setClient, client } = React.useContext(GeneralContext);
    const [show, setShow] = React.useState<boolean>(false);
    const [showUserPg, setShowUserPg] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string | null>(null);

    const [turnOn, setTurnOn] = React.useState<boolean>(false);
    React.useEffect(() => {
        setTimeout(() => {
            setTurnOn(true);
        }, 2500);
    }, []);

    React.useEffect(() => {
        if (!pathname) return setShow(false) ///-/blog/usershomelinks/Bob%20Brown
        const usershomelinks: string | undefined = pathname.split("/")[2];
        if (!usershomelinks || usershomelinks !== "usershomelinks") return setShow(false)
        setShow(true) // enables group usershomelinks landing page
        const userHomePage: string | undefined = pathname.split("/")[3];
        if (!userHomePage) return setShowUserPg(false)
        const decodeUserHomePg = userHomePage.replace("-", " ");
        setUsername(decodeUserHomePg)
        setShowUserPg(true);

    }, [pathname, setShow, setShowUserPg, setUsername]);

    React.useMemo(async () => {
        if (username) {
            const getuser = await getUserMeta(username);
            if (!getuser) {
                let message: string = `did not get userdata@api/getusermeta in HomeLinksHeader`
                setGetError(message)
                return
            }
            setClient(getuser)
        }
    }, [username, setClient, setGetError]);

    const container = `${styles.containerImage} lg:container mx-auto mb-2 p-1 pb-2`
    const sectionStyle = "flex flex-col justify-center items-center mx-auto sm:h-[36vh] h-[30vh] lg:h-[40vh] relative "
    return (
        <React.Fragment>
            {show &&
                <div className={container}>
                    <section className={sectionStyle}>
                        <div className={styles.ImgContainerDash}>
                            {client && client.image ?
                                <Image src={client.image} width={75} height={75} alt="www.garymasterconnect.com"
                                    className={`${styles.dashImg} bg-slate-900 rounded-full p-2 border border-white `}
                                />
                                :
                                <Image src={url} width={75} height={75} alt="www.garymasterconnect.com"
                                    className={`${styles.dashImg} bg-slate-900 rounded-full p-2 border border-white `}
                                />
                            }
                        </div>

                    </section>
                </div>
            }

        </React.Fragment>
    )
}
