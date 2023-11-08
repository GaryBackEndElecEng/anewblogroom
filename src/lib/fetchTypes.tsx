import type { inputType, userType, contactType, mainPageHit, s3mediaType, linkType, postType, likefileType, likepostType, ratefileType, ratepostType, fileType, userTypeShort } from "@lib/Types";

import axios from "axios";

// export const config = { runtime: 'experimental-edge' }

//GET ALL USER'S FILE OR RETURNS A SINGLE FILE LENGTH=1
export async function getuserFiles(userID: string) {
    try {
        const { data } = await axios.get(`/api/getuserfiles?userID=${userID}`);
        const recFiles: fileType[] = await data;
        return recFiles
    } catch (error) {
        console.error(new Error(" input from api addinput was not added"))
    }
}
export async function user_files(email: string) {
    // console.log(email) //works
    try {
        const { data } = await axios.get(`/api/user_files?email=${email}`)
        const body: fileType[] = await data;

        return body
    } catch (error) {
        console.error(new Error(" did not get usersfiles"))
    }
}

export async function saveFile(file: fileType) {
    try {
        const { data } = await axios.post("/api/savefile", file);
        const body: fileType = await data;
        // console.log(body)
        return body
    } catch (error) {
        console.error(new Error(" DID NOT SAVE FILE"))
    }
}
//NOT THIS ADDS/UPDATES  AN INPUT TO FILEID EACH TIME WITH OR WITHOUT THE S3IMAGEURL AND SHOULD BE USED AFTER ADDING AND INPUT. THE CALLBACK SHOULD BE INSERTED INTO THE FILE EACH AND EVERY TIME.

export async function addInput(input: inputType) {

    try {
        const { data } = await axios.post("/api/addinput", input);
        const recievedFile: fileType = await data;
        return recievedFile
    } catch (error) {
        console.error(new Error(" input from api addinput was not added"))
    }
}
export async function getMediaInput(input: inputType) {
    if (!input) return
    try {
        const { data } = await axios.get(`/api/getmediainput?inputID=${input.id}&Key=${input.s3Key}`);
        const body: inputType = await data;
        return body
    } catch (error) {

    }
}
export async function getMedia(Key: string): Promise<s3mediaType | undefined> {
    if (!Key) return
    try {
        const { data } = await axios.get(`/api/media?Key=${Key}`)
        const body: s3mediaType = data;
        return body
    } catch (error) {

    }

}
export async function getS3User(user: userType) {
    if (!(user)) return
    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/getuser?userId=${user.id}`);
        const body: userType = data;
        return body

    } catch (error) {
        console.error(new Error("did not get user's image S3 URL"))
    }
}
export async function getEmailUser(email: string) {
    if (!(email)) return
    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/getemailuser?email=${email}`);
        const body: userType = data;
        return body

    } catch (error) {
        console.error(new Error("did not get user's image S3 URL"))
    }
}

export async function getUsers() {

    try {
        const { data } = await axios.get("/api/users");
        const body: userType[] = await data as userType[]
        return body
    } catch (error) {
        console.error(new Error("server issues"))
    }
}
export async function getUser(userId: string) {
    try {
        const { data } = await axios.get(`/api/getuser?userId=${userId}`);
        const user: userTypeShort = await data as userTypeShort
        return user
    } catch (error) {
        console.error(new Error("server issues"))
    }
}
export async function getUserMeta(username: string) {
    try {
        const { data } = await axios.get(`/api/getusermeta?username=${username}`);
        const user: userType = await data as userType
        return user
    } catch (error) {
        console.error(new Error("server issues"))
    }
}
export async function getUsernamePage(username: string): Promise<userTypeShort | undefined> {
    try {
        const { data } = await axios.get(`/api/getusernamepage?username=${username}`);
        const user: userTypeShort = await data as userTypeShort
        return user
    } catch (error) {
        console.error(new Error("server issues"))
    }
}
export async function updateInput(input: inputType | null) {
    if (!input) { return }
    try {
        const { data } = await axios.post("/api/updateinput", input);
        const newInput: inputType = await data;
        // console.log(recNewFile)
        return newInput
    } catch (error) {
        console.error(new Error(" input from api addinput was not added"))
    }
}
export async function updateInputOnly(input: inputType | null) {
    if (!input) { return }
    try {
        const { data } = await axios.post("/api/inputupdatenew", input);
        const recInput: inputType = await data;
        return recInput
    } catch (error) {
        console.error(new Error(" input from api addinput was not added"))
    }
}

//NOTE: THIS RETURNS PRESIGNED URLS TO file.imageUrl and image inputTypes userID, fileID 
export async function getFile(fileID: string) {

    try {
        const res = await fetch(`/api/getfile?fileID=${fileID}`);
        const body: fileType = await res.json();
        console.log(body)
        return body
    } catch (error) {
        console.error(new Error(" DID NOT SAVE FILE"))
    }
}
export async function getAllFiles() {
    try {
        const { data } = await axios.get(`/api/getallfiles`);
        const body: fileType[] = await data;
        return body
    } catch (error) {
        console.error(new Error(" DID NOT SAVE FILE"))
    }
}
export async function newFile(userID: string) {

    try {
        const { data } = await axios.get(`/api/newfile?userID=${userID}`);
        const body: fileType = await data as fileType;
        return body
    } catch (error) {
        console.error(new Error(" newFile was not created"))
    }
}

export async function deleteInput(input: inputType) {
    try {
        const { data } = await axios.post(`/api/deleteinput`, input);
        const body: inputType = await data;

        return body
    } catch (error) {
        console.error(new Error(" did not delete"))
    }
}
export async function sendContact(contact: contactType) {
    try {
        const { data } = await axios.post("/api/sendcontact", contact);
        const body = await data;
        return body
    } catch (error) {
        console.error(new Error(" did not send"))
    }
}
export async function sendEmail(contact: contactType) {
    try {
        const { data } = await axios.post("/api/email", contact);
        const body: contactType = await data;
        return body

    } catch (error) {
        console.error(new Error("cantact data was not recieved"))
    }
}

export async function getUserInfo(fileID: string) {
    try {
        const { data } = await axios.get(`/api/getuserinfo?fileID=${fileID}`);
        const body: userType = await data;
        return body
    } catch (error) {
        console.error(new Error(" did not get user"))
    }
}
export async function getPageHits() {
    try {
        const { data } = await axios.get(`/api/getpagehits`);
        const body: mainPageHit[] | undefined = await data;
        return body
    } catch (error) {
        console.error(new Error(" did not get page hits"))
    }
}

export async function postPageHit(pageHit: mainPageHit) {

    try {
        const { data } = await axios.post(`/api/page-hit`, { pageHit });
        //components
        const body: mainPageHit = await data;
        console.log(body)
        return body
    } catch (error) {
        console.error(new Error(" did not record"))
    }
}
export async function saveUser(user: userType) {
    if (!user) return
    // console.log(user) //works
    try {
        const { data } = await axios.post("/api/saveuser", user);
        const body: userType | undefined = data as userType;
        return body
    } catch (error) {
        console.error(new Error("Did not save user"))
    }
}
export async function createLink(link: linkType) {
    if (!link) return
    try {
        const { data } = await axios.post("/api/createlink", link);
        const body: linkType | undefined = data;
        return body
    } catch (error) {
        console.error(new Error("did not save link"))
    }
}
export async function getLinks() {
    try {
        const { data } = await axios.get("/api/getlinks");
        const body: linkType[] = data;
        return body
    } catch (error) {
        // console.error(new Error("did not save link"))
    }
}
export async function storeLinks(links: linkType[], hlink: inputType) {
    if (!(hlink || links)) return
    const lnk: linkType | undefined = links.find(lnk => (lnk.inputId === hlink.id));
    if (lnk) {
        const updateCount = await updateLink(lnk as linkType);
        return updateCount
    } else {
        let lnk: linkType = { url: hlink.content, fileId: hlink.fileId, inputId: hlink.id as number, subject: hlink.name }
        const updateCount = await createLink(lnk);
        return updateCount
    }

}
export async function updateLink(link: linkType) {
    if (!link) return
    try {
        const { data } = await axios.post("/api/updatelink", link);
        const body: linkType | undefined = data;
        return body
    } catch (error) {
        console.error(new Error("did not save link"))
    }
}
export async function getPost(userId: string, postId: number) {
    if (!userId || !postId) return
    try {
        const { data } = await axios.get(`/api/getpost?userId=${userId}&postId=${postId}`);
        const post: postType = await data as postType;
        return post
    } catch (error) {
        console.error(new Error("did not recieve post from getpost"))
    }
}
export async function getPosts() {
    try {
        const { data } = await axios.get(`/api/getposts`);
        const posts: postType[] = await data as postType[];
        return posts
    } catch (error) {
        console.error(new Error("did not recieve posts from getposts"))
    }
}
export async function getUserPosts(userId: string) {
    if (!userId) return
    try {
        const { data } = await axios.get(`/api/getuserposts?userID=${userId}`);
        const posts: postType[] = await data as postType[];
        return posts
    } catch (error) {
        // console.error(new Error("did not recieve post from getpost"))
    }
}
export async function sendPost(post: postType) {
    if (!post) return
    try {
        const { data } = await axios.post(`/api/sendpost`, post);
        const body: postType = await data as postType;
        return body
    } catch (error) {
        console.error(new Error("did not put post from getpost"))
    }
}
export async function postDetail(post: postType) {
    if (!post) return
    try {
        const { data } = await axios.get(`/api/postdetail?postId=${post.id}`);
        const body: postType = await data as postType;
        return body
    } catch (error) {
        console.error(new Error("did not put post from getpost"))
    }
}
export async function sendPostUpdate(post: postType) {
    if (!post) return
    try {
        const { data } = await axios.post(`/api/sendpostupdate`, post);
        const body: postType = await data as postType;
        return body
    } catch (error) {
        console.error(new Error("did not put post from getpost"))
    }
}
export async function deletePost(post: postType) {
    if (!post) return

    try {
        const { data } = await axios.get(`/api/deletepost?userId=${post.userId}&postId=${post.id}`);
        const body: postType = await data as postType;
        return body
    } catch (error) {
        console.error(new Error("did not put post from getpost"))
    }
}
export async function sendFileLike(like: likefileType) {
    if (!like) return
    try {
        const { data } = await axios.post("/api/filelike", like);
        const body: likefileType = data;
        return body
    } catch (error) {
        console.error(new Error("like post was rejected @ filelike?"))
    }
}
export async function sendFileRate(like: ratefileType) {
    if (!like) return
    try {
        const { data } = await axios.post("/api/filerate", like);
        const body: ratefileType = data;
        return body
    } catch (error) {
        console.error(new Error("like post was rejected @ filelike?"))
    }
}
export async function getFileLikes() {
    try {
        const { data } = await axios.get("/api/filelike");
        const body: likefileType[] = data;
        return body
    } catch (error) {
        console.error(new Error("likes get was rejected @ filelike?"))
    }
}
export async function getFileRates() {
    try {
        const { data } = await axios.get("/api/filerate");
        const body: ratefileType[] = data;
        return body
    } catch (error) {
        console.error(new Error("likes get was rejected @ filelike?"))
    }
}
export async function sendPostLike(like: likepostType) {
    if (!like) return
    try {
        const { data } = await axios.post("/api/postlike", like);
        const body: likepostType = data;
        return body
    } catch (error) {
        console.error(new Error("like post was rejected @ postlike?"))
    }
}
export async function sendPostRate(like: ratepostType) {
    if (!like) return
    try {
        const { data } = await axios.post("/api/postrate", like);
        const body: ratepostType = data;
        return body
    } catch (error) {
        console.error(new Error("like post was rejected @ postlike?"))
    }
}
export async function getPostRates() {
    try {
        const { data } = await axios.get("/api/postrate");
        const body: ratepostType[] = data;
        return body
    } catch (error) {
        console.error(new Error("likes get was rejected @ postlike?"))
    }
}
export async function getPostLikes() {
    try {
        const { data } = await axios.get("/api/postlike");
        const body: likepostType[] = data;
        return body
    } catch (error) {
        console.error(new Error("likes get was rejected @ postlike?"))
    }
}

export async function deleteFile(fileID: string) {
    if (!fileID) return
    try {
        const { data } = await axios.get(`/api/deletefile?fileID=${fileID}`);
        const delFile = await data as fileType;
        return delFile;
    } catch (error) {

    }
}
