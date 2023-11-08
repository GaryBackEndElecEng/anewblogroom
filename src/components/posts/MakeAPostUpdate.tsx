import { postType, userType } from '@/lib/Types'
import React from 'react';
import { FormControl, FormLabel, TextField } from '@mui/material';
import { GeneralContext } from '../context/GeneralContextProvider';
import { sendPostUpdate } from '@/lib/fetchTypes';
import { reduceAddNewPost } from '@/lib/generalFunc';
import CancelIcon from '@mui/icons-material/Cancel';
import { InputContext } from '../context/InputTypeProvider';


type fileUrlType = {
    name: string,
    url: string
}

type mainType = {
    post: postType,
    setUpdatePost: React.Dispatch<React.SetStateAction<boolean>>

}
export default function MakeAPostUpdate({ post, setUpdatePost }: mainType) {
    const { setPosts, posts, setUser, setPost, setMsg, msg } = React.useContext(GeneralContext);
    const { userFiles } = React.useContext(InputContext);
    const [tempPost, setTempPost] = React.useState<postType>({} as postType);
    const [fileUrls, setFileUrls] = React.useState<fileUrlType[] | null>(null);

    React.useEffect(() => {
        if (userFiles) {
            let arr: fileUrlType[] = [{ name: "select a file", url: "none" }]
            userFiles.forEach((file, index) => {
                arr.push({ name: file.name, url: file.fileUrl })
            });
            setFileUrls(arr)

        }
    }, [setFileUrls, userFiles]);

    React.useEffect(() => {
        setTempPost(post);
    }, [post, setTempPost]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatepost = await sendPostUpdate(tempPost);
        if (!updatepost) { return setMsg({ loaded: false, msg: "not updated" }) }
        const insertUpdate = reduceAddNewPost(posts, updatepost);
        if (!insertUpdate) { return setMsg({ loaded: false, msg: "not updated" }) }
        setPosts(insertUpdate);
        setMsg({ loaded: true, msg: "updated" })
        setUpdatePost(false);
    }


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.currentTarget) {
            setTempPost({
                ...tempPost,
                [e.currentTarget.name]: e.currentTarget.value
            })
        }
    }
    return (
        <div className="absolute inset-0 z-10000 w-full right-0">
            <CancelIcon sx={{ color: "red", zIndex: "1000" }}
                onClick={() => setUpdatePost(false)}
                className="top-2 right-3 absolute text-2xl text-red-800"
            />
            <form action="" onSubmit={handleSubmit}
                className="w-full  flex flex-col items-center justify-center gap-1 p-1 mx-auto bg-slate-200 rounded-lg shadow shadow-emerald-300 border border-emerald-900 bg-slate-200 "
            >
                <FormControl className=" text-black w-full mx-auto flex flex-col items-center">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Title/subject"
                        aria-label="name"
                        value={tempPost.name ? tempPost.name : " "}
                        onChange={handleOnChange}
                        className="rounded-lg shadow shadow-emerald-300 bg-white w-1/2"
                    />
                </FormControl>

                <TextField
                    label={"Content"}
                    aria-label="content"
                    id={`${post.name}-content`}
                    fullWidth={true}
                    multiline={true}
                    placeholder={"write a story/thought or statement"}
                    helperText={"something interesting or relevant"}
                    minRows={4}
                    maxRows={20}
                    value={tempPost.content ? tempPost.content : " "}
                    type="text"
                    name="content"
                    onChange={handleOnChange}
                    className="rounded-lg shadow shadow-emerald-300 bg-white w-full mx-auto flex flex-col items-center"
                />
                <FormControl className=" text-black w-full mx-auto flex flex-col items-center">
                    <FormLabel htmlFor="bloglink">select a blog</FormLabel>
                    <select
                        id="bloglink"
                        name="bloglink"
                        placeholder="link to blog"
                        aria-label="bloglink"
                        value={post.bloglink ? post.bloglink : " "}
                        onChange={(e) => {
                            setPost({ ...post, bloglink: e.target.value })
                        }}
                        className="rounded-lg shadow shadow-emerald-300 bg-white"
                        style={{ width: "fit-content" }}
                    >
                        {fileUrls && fileUrls.map((obj, index) => {


                            return (
                                <React.Fragment key={index}>
                                    <option value={obj.url}>{obj.name}</option>
                                </React.Fragment>
                            )

                        })}
                    </select>
                </FormControl>
                <button className="button my-2 text-black" type="submit">post it</button>
            </form>
        </div>
    )
}
