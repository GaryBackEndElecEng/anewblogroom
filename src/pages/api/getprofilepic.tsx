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
    console.log(req.headers)
    const Key = req.query.Key as string;
    // console.log("GetProfilePic", Key)
    if (!(Key)) res.status(400).json({ message: "missing parameters" })
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
            res.setHeader('Cache-Control', 'max-age=14400')
            res.status(200).json(retObj)
        } else {
            res.status(400).json({ imageUrl: null, key: Key })
        }
    } catch (error) {

        console.error(new Error("Did not get imageUrl"))
    }

}