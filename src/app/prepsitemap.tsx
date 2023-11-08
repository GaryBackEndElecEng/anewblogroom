

import mainLinks from "@meta/mainLinks";
import { MetadataRoute } from 'next';

export type promiseType = {
    url: string,
    lastModified: Date,
    changeFrequency: string,
    priority: number
}
export async function genArr(): Promise<MetadataRoute.Sitemap> {
    const site = (process.env.NODE_ENV === 'production') ? "https://www.masterultils.com" : "http://localhost:3000";
    let arr: MetadataRoute.Sitemap = [];
    mainLinks.forEach((obj) => {
        arr.push({ url: `${site}${obj.link}`, lastModified: new Date(), changeFrequency: "always", priority: 1 });
    });

    return arr


}