

import prisma from "@_prisma/client";
import { fileType, postType, userAccountType, userType } from "@lib/Types";
import { getServerSession } from "next-auth";
import authOptions from "./authOptions";
import "@aws-sdk/signature-v4-crt"
import { getEmailUser, getUser } from "./fetchTypes";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";
import { check } from "@lib/generalFunc"

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

//THIS HAS ALL POSTS AND FILES WITH PICS
export async function getUser_(): Promise<userType | undefined> {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return
    if (session.user && session.user.email) {
        const email = session.user.email;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
                include: {
                    files: true,
                    posts: true
                }
            });

            if (user) {
                let user1: userType = user as userType;
                if (user1.imgKey) {
                    const params = {
                        Bucket,
                        Key: user1.imgKey
                    }
                    const command = new GetObjectCommand(params);
                    user1.image = await getSignedUrl(s3, command, { expiresIn: 3600 });
                }
                if (user1.files && user1.files.length!!) {
                    const userfiles = await Promise.all(
                        user1.files.map(async (file) => {
                            if (file.imageKey && check(file.imageKey)) {

                                const params = {
                                    Bucket,
                                    Key: file.imageKey
                                }
                                const command = new GetObjectCommand(params);
                                file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                                return file
                            } else {
                                return file
                            }
                        })
                    );
                    return { ...user1, files: userfiles }
                } if (user1.posts && user1.posts.length!!) {
                    const userPosts = await Promise.all(
                        user1.posts.map(async (post) => {
                            if (post.s3Key && check(post.s3Key)) {

                                const params = {
                                    Bucket,
                                    Key: post.s3Key
                                }
                                const command = new GetObjectCommand(params);
                                post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                                return post
                            } else {
                                return post
                            }
                        })
                    );
                    return { ...user1, posts: userPosts }
                }

                return user1
            }
        } catch (error) {
            throw new Error("issues getting users")
        } finally {
            await prisma.$disconnect()
        }
    }
}
export async function getPostDetail(postId: number): Promise<postType | undefined> {

    if (!postId) return
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                likes: true,
                rates: true
            }
        });
        if (post) {
            let post1: postType = post;
            if (post1.s3Key) {
                const params = {
                    Key: post1.s3Key,
                    Bucket
                }
                const command = new GetObjectCommand(params);
                post1.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            }
            return post1
        }
    } catch (error) {
        throw new Error("issues getting users")
    } finally {
        await prisma.$disconnect()
    }

}

export async function getFileDetail(fileId: string): Promise<fileType | undefined> {
    if (!fileId) return
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileId
            },
            include: {
                likes: true,
                rates: true,
                inputTypes: true
            }
        });
        if (file) {
            let file1: fileType = file;
            if (file1.imageKey && check(file1.imageKey)) {
                const params = {
                    Bucket,
                    Key: file1.imageKey
                }
                const command = new GetObjectCommand(params);
                file1.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            } if (file1.inputTypes && file1.inputTypes!!) {
                const inputs = await Promise.all(
                    file1.inputTypes.map(async (input) => {
                        if (input.name === "image" && check(input.s3Key as string)) {
                            const params = {
                                Bucket,
                                Key: input.s3Key as string
                            }
                            const command = new GetObjectCommand(params);
                            input.url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                        }
                        return input
                    })
                );
                return { ...file1, inputTypes: inputs }
            }
            return file1
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}


export async function getUserAccount() {

    const session = await getServerSession(authOptions);
    var account: userAccountType = {} as userAccountType;
    if (session) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user?.email as string
                }
            });
            if (user) {
                account = {
                    loaded: true,
                    data: {
                        status: "authenticated",
                        id: user.id,
                        name: session.user?.name as string,
                        email: session.user?.email as string,
                        image: session.user?.image ? session.user?.image : user.image,
                        imgKey: user.imgKey ? user.imgKey : undefined

                    }
                }
            }
        } catch (error) {

        } finally {
            await prisma.$disconnect()
        }

    } else {
        account = {
            loaded: false,
            data: {
                status: "unauthenticated",
                id: "",
                name: "",
                email: "",
                image: "",
                imgKey: undefined

            }
        }
    }
    return account


}

export async function getGenFiles(): Promise<fileType[] | undefined> {

    try {
        const files = await prisma.file.findMany({
            include: {
                inputTypes: true,
                likes: true,
                rates: true
            }
        })
        if (files) {
            const newFiles = await Promise.all(
                files.map(async (file) => {
                    if (file.imageKey) {
                        const params = { Key: file.imageKey, Bucket }
                        const command = new GetObjectCommand(params);
                        file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })

                    }
                    return file
                }));
            return newFiles
        }

    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}


export async function getPosts(): Promise<postType[] | undefined> {
    try {
        const posts = await prisma.post.findMany({
            include: {
                likes: true,
                rates: true
            }
        });

        const s3Posts = await Promise.all(
            posts.map(async (post) => {
                if (post.s3Key && check(post.s3Key)) {
                    const params = {
                        Bucket,
                        Key: post.s3Key
                    }
                    const command = new GetObjectCommand(params);
                    post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    return post
                } else {
                    return post
                }
            })
        )
        return s3Posts
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}

export async function getUsers(): Promise<userType[] | undefined> {
    try {
        const users = await prisma.user.findMany({
            include: {
                files: true,
                posts: true
            }
        });
        if (users) {
            let tempUsers = users as userType[];
            const allUser = await Promise.all(
                tempUsers.map(async (user) => {
                    if (user.imgKey && check(user.imgKey)) {
                        const params = { Key: user.imgKey, Bucket };
                        const command = new GetObjectCommand(params);
                        user.image = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    return user
                })
            );
            return allUser
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}


export async function getUserUserName(username: string): Promise<userType | undefined> {
    if (!username) return
    try {
        const users = await prisma.user.findMany({
            where: {
                name: username
            },
            include: {
                files: true,
                posts: true
            },
        });

        if (users && users[0]) {

            let tempUser: userType = users[0] as userType;
            if (tempUser.imgKey) {
                const params = { Key: tempUser.imgKey, Bucket };
                const command = new GetObjectCommand(params);
                tempUser.image = await getSignedUrl(s3, command, { expiresIn: 3600 });

            }

            if (tempUser.files && tempUser.files.length!!) {
                const files = await Promise.all(
                    tempUser.files.map(async (file) => {
                        if (file.imageKey && check(file.imageKey)) {

                            const params = { Key: file.imageKey, Bucket };
                            const command = new GetObjectCommand(params);
                            file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

                        } if (file.inputTypes && file.inputTypes.length > 0) {
                            file.inputTypes.map(async (input) => {
                                if (input.s3Key && check(input.s3Key) && input.name === "image") {

                                    const params = { Key: input.s3Key, Bucket };
                                    const command = new GetObjectCommand(params);
                                    input.url = await getSignedUrl(s3, command, { expiresIn: 3600 });

                                }
                                return input
                            })
                        }
                        return file
                    })
                );

                return { ...tempUser, files: files }
            }
            if (tempUser.posts && tempUser.posts && tempUser.posts.length > 0) {
                const posts = await Promise.all(
                    tempUser.posts.map(async (post) => {
                        if (post.s3Key && check(post.s3Key)) {

                            const params = { Key: post.s3Key, Bucket };
                            const command = new GetObjectCommand(params);
                            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                            return { ...post, imageUrl: url }
                        } else {
                            return post
                        }

                    })
                );

                return { ...tempUser, posts: posts }
            }

            return tempUser
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}