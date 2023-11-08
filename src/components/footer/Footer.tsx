import React from 'react';
import styles from "./footer.module.css";
import BlogMaker from "./BlogMaker";

export default function Footer() {
    const url = "/images/webService.png"
    return (
        <div className={`${styles.mainFooter} w-full mx-auto lg: min-h-[10vh] bg-slate-800 border border-emerald-500 mb-2`}>
            <div className="grid grid-cols-1  lg:grid-cols-3 place-items-center place-content-center gap-5">

                <div className={`${styles.spanCol} col-span-1 relative`}>
                    <BlogMaker />
                </div>
                <div className={`${styles.spanCol} col-span-1`}>
                    <h4>www.garymasterconnect.com</h4>
                    <h3>@copyright: {new Date().getFullYear()}</h3>

                    <h4>Free Blogs</h4>
                </div>
                <div className={`${styles.spanCol} col-span-1`}>
                    <h3 className=" cursor-pointer text-white hover:text-orange-800">policy</h3>
                </div>
            </div>
        </div>
    )
}
