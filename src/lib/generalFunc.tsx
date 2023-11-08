import React from 'react';
import { fileType, gets3ImageType, linkType, postType, userType } from "@lib/Types";
import { inputType, inputArr } from "./Types";
// import { gets3Image } from "./s3ApiComponents";
import { v4 as uuidv4 } from 'uuid';
import { addInput, deleteInput, } from "@lib/fetchTypes";
import axios from 'axios';

export function genFileUrl(user: userType, file: fileType) {
    if (user && user.name) {
        const username = user.name.replace(" ", "-");
        const url = `/blog/usershomelinks/${username}/${file.id}`
        return url

    }
}

export function insertType(type: string) {
    if (type === "image") return "image/png"
    return "text"
}
export function updateFile(file: fileType, input: inputType | null) {
    if (!input || !file) return
    const reduceFile = file.inputTypes.filter(Input => Input.id !== input.id);

    const retFile: fileType = { ...file, inputTypes: [...reduceFile, input] }

    return retFile
}
export function updatefileInput(file: fileType, input: inputType) {
    const reduceInps = file.inputTypes.filter(input_ => (input_.id !== input.id));
    const fillInputs: inputType[] = [...reduceInps, input]
    return { ...file, inputTypes: fillInputs as inputType[] }
}




//THIS IS OPERATING @ THE INPUTCOMPLEXPROVIDER!!
export async function newFileAndInputControlPoint(
    select: string,
    file: fileType
) {
    const encode = uuidv4().split("-")[0];
    const encode1 = uuidv4().split("-")[1];
    const s3KeyGen = `${encode}-${select}-${encode1}`;
    const genInput: inputType = {
        name: select,
        content: select,
        url: null,
        s3Key: s3KeyGen,
        type: select === "image" ? "image/png" : "text",
        fileId: file.id
    }
    const recFile = await addInput(genInput);
    if (recFile) {
        return recFile
    }
}

export function addSelectAndSpread(select: string, file: fileType): fileType {
    const type = insertType(select);
    if (file) {
        const createInput: inputType = {
            name: select,
            content: "",
            s3Key: "",
            type: type,
            url: "",
            fileId: file.id

        };
        if (file.inputTypes?.length > 0) {
            // console.log(select, file.inputTypes)
            let addInput = [...file.inputTypes, createInput]
            return { ...file, inputTypes: addInput }
        } else {
            return { ...file, inputTypes: [createInput] }
        }

    } else {
        return file
    }
}

export function inputComponent(file: fileType, subject: string, content: string | ""): inputType | undefined {
    const type = insertType(subject);
    const head: inputType = {
        name: subject,
        content: content,
        type: type,
        url: null,
        s3Key: null,
        fileId: file.id

    }
    return head
}
export function reduceModAndAddComp(file: fileType, modComp: inputType): fileType | undefined {
    let tempFile = file;
    if (!tempFile) return
    tempFile.inputTypes.map((input, index) => {
        let getInpuTypes = tempFile.inputTypes[index] as inputType
        if (modComp.name === input.name) {
            getInpuTypes = modComp as inputType;
            tempFile.inputTypes[index] = getInpuTypes as inputType
        }

    });
    return tempFile
}

export function inputComponentImage(file: fileType, subject: string, inputtype: inputType, s3Key: string | undefined): inputType | undefined {
    if (!(s3Key && subject === "image")) return inputtype
    const Input = {
        name: subject,
        content: inputtype.content,
        url: inputtype.url,
        type: inputtype.type,
        s3Key: s3Key,
        fileId: file.id

    }
    return Input

}
export function objsToArr(keyValues: { [key: string]: string }): { key: string, value_: string }[] {
    let arr: { key: string, value_: string }[] = []
    for (const [key, value] of Object.entries(keyValues)) {
        if (!value || value === null || value === undefined) break
        arr.push({ key: key, value_: value });
    }
    return arr
}
export function checkvalues(arr: { key: string, value_: string }[], prop: { key: string, value: string }): boolean {
    let check = false;
    arr.forEach((obj, index) => {
        if (obj.key === prop.key) {
            if (obj.value_ !== prop.value) return check = true

        }
    });
    return check
}
export function check(s3Key: string): boolean {
    const arr: string[] = ["jpeg", "png", "jpg"];
    let bool: boolean = false;
    arr.map((end, index) => {
        if (s3Key.toLowerCase().endsWith(end) || s3Key.toUpperCase().endsWith(end)) {
            return bool = true
        }
    });
    return bool
}

export function insertInput(file: fileType, input: inputType, prop: { key: string, value: string, subject: string }): fileType {
    let tempFile: fileType = file;
    const type = insertType(prop.subject);
    tempFile = {
        id: (prop.key === "id") ? prop.value : file.id,
        name: (prop.key === "name") ? prop.value : file.name,
        date: file.date,
        userId: file.userId,
        published: (prop.key === "published") ? true : false,
        content: (prop.key === "content") ? prop.value : file.content,
        fileUrl: file.content,
        title: (prop.key === "title") ? prop.value : file.title,
        imageKey: (prop.key === "imageKey" ? prop.value : file.imageKey),
        imageUrl: (prop.key === "imageUrl" ? prop.value : file.imageUrl),
        likes: file.likes,
        rates: file.rates,
        inputTypes: tempFile.inputTypes.map((input, index) => {
            input = {
                id: (prop.key === "id" && prop.subject === input.name) ? Number(prop.value) : input.id,
                name: (prop.key === "name" && prop.subject === input.name) ? prop.value : input.name as string,
                content: (prop.key === "input" && prop.subject === input.name) ? prop.value : input.content as string,
                url: (prop.key === "url" && prop.subject === input.name) ? prop.value : input.url,
                type: type,
                s3Key: (prop.key === "s3Key" && prop.subject === input.name) ? prop.value : input.s3Key as string,
                fileId: file.id

            }
            return input
            // console.log("InserInput()=>InputType", inputtype)
        })
    }
    if (!tempFile) return file
    return tempFile
}

//s3Keys are unique=> match s3Keys=> insert Url into image

// export async function inputInsertUrl(key: string | null, fileType: string | undefined, file: fileType, input: inputType) {
//     const check = (input.name === "image" && key && fileType) ? true : false;
//     let getUrl: string | undefined;
//     let getS3Key: string | undefined;
//     let getImageObj: inputType | undefined;
//     if (check && key && fileType && input.s3Key) {
//         const data: gets3ImageType | undefined = await gets3Image(input.s3Key, input.type, file.id);
//         if (!data) return
//         const { imageUrl, key, imageObj, msg } = data
//         getUrl = imageUrl;
//         getS3Key = key;
//         getImageObj = imageObj
//     }
//     let tempFile = file;
//     if (!getImageObj) return
//     const removed_inputTypeArr = tempFile.inputTypes.filter(inputType => (inputType.id !== input.id));

//     const addNewFile = { ...tempFile, inputTypes: [...removed_inputTypeArr, getImageObj] }
//     return { newFile: addNewFile, imageObj: getImageObj }

// }

export async function removeComponent(file: fileType, deleteUnit: inputType) {
    if (!(file && deleteUnit)) return
    const body: inputType | undefined = await deleteInput(deleteUnit);
    if (!body) return
    const reduceInput = file.inputTypes.filter(input => (input.id !== body.id));
    const newFile: fileType = { ...file, inputTypes: reduceInput }
    return newFile
}
export const matchEnd = (input: inputType) => {
    let arr: string[] = [".png", ".jpeg", ".Web", "PNG", "JPEG"]
    let check: boolean = false;
    arr.forEach((end, index) => {
        if (input.s3Key?.endsWith(end)) {
            return check = true
        }
    });
    return check
}
export function matchLink(links: linkType[], link: linkType): boolean {
    let bool: boolean = false;
    links.forEach((lnk, index) => {
        if (lnk.id === link.id) {
            return bool = true
        }
    });
    return bool

}


export function selectControl(input: inputType) {

    const checkName: boolean = inputArr.find((name) => (name === input.name)) ? true : false;
    return checkName
}
export function quickFileUpdate(file: fileType, input: inputType) {
    let tempFile: fileType = file;
    if (!tempFile || !input) return
    let reducerInput = tempFile.inputTypes.filter(inp => (inp.id !== input.id))
    tempFile = { ...tempFile, inputTypes: [...reducerInput, input] }
    return tempFile
}
export function quickFileRemove(file: fileType, input: inputType) {
    let tempFile: fileType = file;
    if (!tempFile || !input) return
    let reducerInput = tempFile.inputTypes.filter(inp => (inp.id !== input.id))
    tempFile = { ...tempFile, inputTypes: reducerInput }
    return tempFile
}
export function removeFile(files: fileType[], fileID: string) {
    if (!files || !fileID) return
    const reduceF = files.filter(file => (file.id !== fileID));
    return reduceF

}
export function removeUserFile(userfiles: fileType[], fileID: string) {
    if (!userfiles || !fileID) return
    const reduceF = userfiles.filter(file => (file.id !== fileID));
    return reduceF

}
export function removeDuplicates<type>(arr: type[]): type[] {
    const cleaned = arr.filter((item, index) => (arr.indexOf(item) === index));
    return cleaned
}
export function getUserObj(users: userType[], userId: string) {
    if (!userId || !users) return
    return users.find(user => (user.id === userId))
}

export function reduceAddNewPost(posts: postType[], post: postType) {
    if (!posts || !post) return
    const reduce: postType[] = posts.filter(post_ => (post_.id !== post.id)).sort((a: postType, b: postType) => ((a.id as number) - (b.id as number)));
    return [...reduce, post]
}

export function inputFreeze(input: inputType) {
    let endTags: string[] = [".png", ".jpg", ".jpeg"];
    let bool = false;
    const check: boolean = (input.name === "image" && input.url) ? true : false;
    for (let i = 0; i < endTags.length; i++) {
        if (input.s3Key?.endsWith(endTags[i]) && check) {
            bool = true
            break;
        }
    }
    if (bool) {
        return Object.freeze(input)
    } else {
        return input
    }
}




