import React from 'react';
import styles from "./header.module.css";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';



export default function Features() {
    return (
        <section className={`${styles.bg_image}  relative p-0 border-2 border-orange-800 rounded-xl relative mr-2 `}
            style={{ backgroundImage: "url(/images/happyFamily.png)", }}>
            <div className={`${styles.featureInset} bg-slate-900/90 border border-emerald-700`}>
                <h3 className="text-2xl font-bold text-center mb-2"> Features</h3>
                <ul className={`${styles.unorder} mx-auto self-start`}>
                    <li>
                        <ArrowCircleRightIcon sx={{ color: "red", mr: 1 }} />
                        <span>Own Web-Page : </span>Your own web-page, where all your blogs are held. This allows you to promote your brand and allows for quick and effective distribution.
                    </li>
                    <li >
                        <ArrowCircleRightIcon sx={{ color: "red", mr: 1 }} />
                        <span>Own Dashboard : </span>Your own secure place that allows you to edit and publish your blogs along with additional needed tooling to personalize your work.
                    </li>
                    <li >
                        <ArrowCircleRightIcon sx={{ color: "red", mr: 1 }} />
                        <span>Dynamic Google Meta Update: </span> When published, the system sends google your page updates, with auto-generated search params for improved hits.
                    </li>
                    <li >
                        <ArrowCircleRightIcon sx={{ color: "red", mr: 1 }} />
                        <span>Auto Media-Meta Compatibility : </span> You have the ease to distribute your blogs on any media site ( ie; FaceBook,Twitter,,,) or any msm text service with one click. The embedded meta automatically uploads your main image along with your title and summary.
                    </li>
                    <li >
                        <ArrowCircleRightIcon sx={{ color: "red", mr: 1 }} />
                        <span>Personal Enhance-Tooling : </span> You have all the tools you need to help you determine the positive effects of your blogs through actual page hits, all in one perspective.
                    </li>
                </ul>
            </div>

        </section>
    )
}
