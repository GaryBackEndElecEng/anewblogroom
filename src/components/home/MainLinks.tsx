import Link from 'next/link'
import React from 'react'
import Button from "@component/comp/Button";
import styles from "./home.module.css"
import LinkButton from "./LinkButton";
import type { dataType, userAccountType } from "@lib/Types";
import type { Session } from "next-auth";

const mainLinks: dataType[] = [{ name: "blog", link: "/blog", desc: "User's blogs" }, { name: "users posts", link: "/posts", desc: "Users information posts" }, { name: "dashboard", link: "/blog/dashboard", desc: "Users personal dashboard" }, { name: "user's home links", link: "/blog/usershomelinks", desc: "links to users home page" }]





export default function MainLinks({ session }: { session: Session | null }) {



    return (
        <div className="container mx-auto my-3 mb-4">
            <div className={`${styles.links} flex flex-row flex-wrap gap-3 justify-around items-center`}>
                {
                    mainLinks.map((dataLink, index) => (
                        <React.Fragment key={index}>
                            <LinkButton dataLink={dataLink} session={session} />
                        </React.Fragment>
                    ))
                }

            </div>
        </div>
    )
}
