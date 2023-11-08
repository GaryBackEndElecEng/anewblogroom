"use client";
import React from 'react'
import Image from "next/image";
import styles from '@component/header/header.module.css';
import Features from "./Features";
import { GeneralContext } from '../context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import NeedRegister from "./NeedRegister";
import { userAccountType } from '@/lib/Types';

export const introArr = [
    { id: 1, ital: "Firstly", phr: "you have your very own ", ital1: "Home Page, with your name in the URL", phr1: " along with, your generated head board with a summary list of ALL your blogs." },
    { id: 2, ital: "Secondly, ", phr: "You have your own private ", ital1: "Dashboard Page", phr1: " with your own tools and information to help guide and manage your blogs. These include,", ital2: " PAGE HITS, REPLY LIST ( with comments), your own LINK LIST, QUICK PUBLISH ACCESS", phr2: "and so much more", phr3: "", ital3: "!! ." },
    { id: 3, ital: "Thirdly ,", phr: " once you ", ital1: "publish your blog, with one click ,", phr1: " your blog is automatically added to google and explorer, through a ", ital2: "Dynamic Meta Site ", phr2: "update machine, reducing the registration time." },
    { id: 4, ital: "Fourly,", phr: " with ", ital1: "Dynamic Meta update, ", phr1: "you can freely send your blog link to any social media site with a ", ital2: "professional look, ", phr2: "all in one link. All your links will have metadata that facilitates a well structured format, allowing ", ital3: "easy link distribution." },
    { id: 5, ital: "Finally ,", phr: "Advertisizing,,,", ital1: "Make money,,", phr1: " Sexy look and feel" },
]
//all your links will have metadata that facilitates blog distribution through social media. This allows easy link distribution.
type accountType = {
    account: userAccountType | undefined;
}
export default function SubHeader({ account }: accountType) {

    const pathname = usePathname();
    const { setPageHit } = React.useContext(GeneralContext);
    const [show, setShow] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!pathname) return
        if (pathname === "/") {
            setShow(true);
        } else { setShow(false); }
        setPageHit({ name: "none", page: "/home" })
    }, [setPageHit, pathname]);
    return (
        <div className="mx-auto px-2 flex flex-col items-center bg-slate-900">
            {show &&
                <React.Fragment>
                    <div className="flex flex-row flex-wrap justify-center items-center my-2 gap-3">
                        <h2 className="m-auto text-3xl sm:text-4xl">
                            Welcome &#129306; To the
                        </h2>
                        <h3 className="m-auto text-2xl sm:text-4xl">
                            <q style={{ fontStyle: "italic" }} className="text-orange-300 font-bold">Blog Room</q>
                        </h3>
                    </div>
                    <section className={`relative grid grid-cols-1 lg:grid-cols-2 place-items-center gap-3 lg:gap-1 whitespace-wrap px-2 sm:px-0`}
                    >
                        <section className="col-span-1  flex flex-col items-start justify-start prose prose-lg prose-invert mb-2">
                            <p className={`${styles.para} mt-12 mb-12 text-xl text-left dark:text-white`}>
                                <Image
                                    className={`${styles.profile} border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full  border border-white `}
                                    src={"/images/profile.png"}
                                    width={100}
                                    height={100}
                                    alt="Gary Wallace,www.garymasterconnect.com, www.masterconnect.ca , www.masterultils.com"
                                    priority={true}
                                />

                                <span className="font-bold  text-orange-300 whitespace-wrap">A Developer who created a Free blog for you. </span>

                                <span className={styles.paraspan}>
                                    {introArr && introArr.map((obj, index) => (
                                        <React.Fragment key={index}>
                                            {obj.ital && <span> {obj.ital}</span>}
                                            {obj.phr && obj.phr}
                                            {obj.ital1 && <span className="italic" >{obj.ital1}</span>} {obj.phr1 && obj.phr1}
                                            {obj.ital2 && <span className="italic" >{obj.ital2}</span>} {obj.phr2 && obj.phr2}
                                            {obj.ital3 && <span className="italic" >{obj.ital3}</span>} {obj.phr3 && obj.phr3}
                                        </React.Fragment>
                                    ))
                                    }
                                </span>

                            </p>
                            <blockquote>
                                <q>
                                    learning is growing
                                </q>
                                <span>- Gary Wallace</span>
                            </blockquote>
                        </section>
                        <section className={`${styles.column2} col-span-1 mb-2`}>

                            <Features />
                        </section>

                    </section>
                    {!(account && account.loaded) && <NeedRegister />}
                </React.Fragment>
            }
        </div>
    )
}