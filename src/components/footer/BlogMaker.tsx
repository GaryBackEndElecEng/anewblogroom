import React from 'react';
import styles from "./footer.module.css";
import Image from 'next/image';

export default function BlogMaker() {
    const GB = "/images/gb_logo.png";
    const url = "/images/bgWave.png"
    return (
        <div style={{ backgroundImage: `url(${url})` }}
            className={`${styles.image} relative w-full h-[30vh] sm:h-auto`}
        >
            <div className="flex flex-row flex-wrap gap-2 justify-evenly items-center p-2 w-full absolute inset-0 bg-slate-800/60">
                <Image
                    src={GB}
                    alt={"www.garymasterconnect.com, www.masterconnect.ca, www.masterultils.com"}
                    width={120} height={120}
                />
                <div className="flex flex-row flex-wrap gap-3 text-center text-xl bg-slate-800/80 p-2 rounded-xl shadow shadow-slate-800">
                    <h3 className="font-bold">
                        Blog-Room
                    </h3>
                    <h3 className="font-bold">
                        masterconnect.ca,
                    </h3>
                    <h3 className="font-bold">
                        masterultils.com
                    </h3>
                </div>
            </div>

        </div>
    )
}
