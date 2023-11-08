
"use server"
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { fileType, inputType, gets3ImageType, gets3ProfilePicType, mediaType, postType, userType } from '@lib/Types';

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";

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

type masterData = {
    data: mainData
}
type mainData = {
    uploadUrl: string,
    key: string,
    msg: string
}


export async function uploadToS3(e: React.FormEvent<HTMLFormElement>, imageObj: inputType) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const file: File = formdata.get("file") as File
    if (!file) return null
    const ext = file.type.split("/")[1]
    // console.log("key", key)
    const Key = `${file?.name.split(".")[0]}-${imageObj.s3Key}.${ext}`
    formdata.append("file", file);
    formdata.append("Key", Key);


    try {
        await fetch("/api/uploadImage", {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formdata
        });
        const res = await fetch(`/api/downloadimg?Key=${Key}`);
        const body: gets3ImageType = await res.json();
        return body

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}
export async function uploadProfileToS3(e: React.ChangeEvent<HTMLFormElement>, user: userType) {
    e.preventDefault();
    const genUuid = uuidv4().split("-")[0]
    if (!(user.name)) return
    const username = user.name.replace(" ", "-")
    const userImage = `${genUuid}-${username}`
    const formdata = new FormData(e.currentTarget);
    const file: File = formdata.get("file") as File

    if (!file) return null
    const ext = file.type.split("/")[1]
    const key = `${userImage}.${ext}`
    const Key = `${userImage}.${ext}`
    formdata.append("file", file);
    // formdata.append("filename", file?.name);
    formdata.append("Key", key);

    try {
        //api/media has req.query.fileType/& Key
        await fetch("/api/uploadImage", {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formdata
        });
        const res = await fetch(`/api/downloadimg?Key=${key}`);
        const body: gets3ProfilePicType = await res.json();
        return body;


    } catch (error) {
        throw new Error("did not get urlkey")
    }
}





export async function fileUploadToS3(e: React.FormEvent<HTMLFormElement>, file: fileType) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const file_: File = formdata.get("file") as File
    if (!file_) return null
    const ext = file_.type.split("/")[1];
    const genKey = `${uuidv4().split("-")[0]}-${file.name}-${uuidv4().split("-")[0]}`
    const Key = `${genKey}.${ext}`
    const fileType = new URLSearchParams(file_.type).toString();
    formdata.append("file", file_);
    formdata.append("Key", Key);

    try {
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlenc",
            },
            body: formdata
        }
        await fetch(`/api/uploadImage`, options);

        const res = await fetch(`api/downloadimg?Key=${Key}`);
        const body: gets3ProfilePicType = await res.json();
        return body

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}
export async function imgPostUploadToS3(e: React.ChangeEvent<HTMLFormElement>, user: userType): Promise<gets3ProfilePicType | undefined> {
    e.preventDefault();
    if (!user! || !user.name) return
    const formdata = new FormData(e.currentTarget);
    const file_: File = formdata.get("file") as File;
    if (!file_) return
    const encodeUsername = user.name.replace(" ", "-")
    const genKey = `${user.id}-${encodeUsername}/${uuidv4().split("-")[0]}-${file_.name}`
    const key = genKey
    const Key = `${genKey}`;
    formdata.append("file", file_);
    formdata.append("Key", Key);

    try {
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlenc",
            },
            body: formdata
        }
        await fetch(`/api/uploadImage`, options);

        const res = await fetch(`api/downloadimg?Key=${Key}`);
        const body: gets3ProfilePicType = await res.json();
        return body

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}



export async function insertFileUrls(file: fileType) {
    // if (!file) return
    let tempFile: fileType = file;
    if (!tempFile.imageKey) return tempFile
    let checkS3 = await checkS3KeyEnd(tempFile.imageKey)
    if (!checkS3) return tempFile
    const s3Params = {
        Bucket,
        Key: tempFile.imageKey,
    };
    // const imageUrl = s3.getSignedUrl(
    //     "getObject", s3Params
    // );
    const command = new GetObjectCommand(s3Params)
    tempFile.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    if (!tempFile.inputTypes || !(tempFile.inputTypes?.length > 0)) return tempFile
    let inputs = tempFile.inputTypes;
    let Arr: inputType[] = [];
    Arr = await insertInputsUrl(inputs as inputType[]);
    tempFile = { ...tempFile, inputTypes: Arr }
    return tempFile
}
export async function insertInputsUrl(inputs: inputType[]) {
    const arr: inputType[] = await Promise.all(
        inputs.map(async (input) => {
            return await insertInputUrl(input)
        })
    )
    return arr
}

export async function insertInputUrl(input: inputType) {
    if (input.name !== "image" && !input.s3Key) return input;
    let checkS3 = await checkS3KeyEnd(input.s3Key as string)
    if (!checkS3) return input
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: input.s3Key as string,
    };
    const command = new GetObjectCommand(s3Params);
    input.url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return input
}

export async function checkS3KeyEnd(s3Key: string | undefined) {
    if (!s3Key) return false
    const arrEnds = [".png", ".jpeg", ".web"];
    let check: boolean = arrEnds.find(end => (s3Key.endsWith(end))) ? true : false
    return check
}
//THIS RETURNS ALL S3 URL TO AN ARRAY OF FILES AND WORKS!!
export async function insertFilesUrls(files: fileType[]) {
    const fileArr: fileType[] = await Promise.all(
        files.map(async (file: fileType) => {
            return await insertFileUrls(file)
        })
    )
    return fileArr
}
export async function gets3Users(users: userType[]) {

    const getUsers = await Promise.all(
        users.map(async (user) => {
            return await insertImgUser(user)
        })
    )
    return getUsers

}
export async function insertImgUser(user: userType) {

    if (!user.imgKey) return user
    const userimage = await getProfilePic(user.imgKey);
    user.image = userimage ? userimage : undefined;
    return user
}

export async function getProfilePic(key: string) {
    if (!key) return null
    let checkS3Key = await checkS3KeyEnd(key)
    if (!checkS3Key) return null
    const res = await fetch(`/api/getprofilepic?Key=${key}`);
    if (res.ok) {
        const body: gets3ProfilePicType = await res.json();
        return body.imageUrl
    } else {
        return null
    }

}

export async function insertUrlPost(post: postType) {
    if (!post.s3Key) return post
    let checkS3Key = await checkS3KeyEnd(post.s3Key)
    if (!checkS3Key) return post
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: post.s3Key,
    };
    const command = new GetObjectCommand(s3Params);
    post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return post

}
export async function insertUrlPosts(posts: postType[]) {
    if (!posts) return
    const arrPost: postType[] = await Promise.all(
        posts.map(async (post) => await insertUrlPost(post))
    )
    return arrPost

}
