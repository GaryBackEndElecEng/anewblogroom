import { NextApiRequest, NextApiResponse } from "next";
import { gets3ProfilePicType } from '@lib/Types';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string

export const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }

});


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const Key = req.query.Key as string;
    console.log("Key", Key)
    if (!(Key)) res.status(400).json({ imageUrl: null, key: null })
    try {
        const params = {
            Key,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
        if (imageUrl) {
            const retObj: gets3ProfilePicType = {
                imageUrl: imageUrl,
                key: Key
            }
            res.status(200).json(retObj)
        } else {
            res.status(400).json({ imageUrl: null, key: Key })
        }
    } catch (error) {
        res.status(500).json({ message: "did not return user's url Pic" })
        console.error(new Error("Did not get imageUrl"))
    }

}