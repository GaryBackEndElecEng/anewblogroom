import { postType, userType } from '@/lib/Types'
import Image from 'next/image'
import React from 'react';
import styles from "@component/posts/posts.module.css";
import { deletePost } from "@lib/fetchTypes";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { GeneralContext } from '../context/GeneralContextProvider';
import Msg from "./Msg";
import getFormattedDate from '@/lib/getFormattedDate';
import MakeAPostUpdate from "./MakeAPostUpdate";

type mainType = {
    post: postType,
    user: userType | null,

}
export default function MakeAPostItem({ post, user }: mainType) {
    const { setMsg, msg, setPosts, posts } = React.useContext(GeneralContext);
    const [updatePost, setUpdatePost] = React.useState<boolean>(false);
    const date = post.date && getFormattedDate(post.date)
    const handleDelete = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, post: postType) => {
        e.preventDefault();
        const delPost = await deletePost(post);
        if (!delPost) {
            return setMsg({ loaded: false, msg: " not deleted" })
        }
        const reduce = posts.filter(post_ => (post_.id !== post.id));
        setPosts(reduce)
        setMsg({ loaded: true, msg: `${delPost.name} deleted` })

    }
    const deleteStyle = "text-red-800 rounded-full p-1 shadow shadow-red-300 border border-slate-800 text-3xl cursor-pointer absolute bottom-5 right-3 z-1000 bg-white "
    return (
        <div className="col-span-1 mx-auto">
            <div className={styles.card}>

                {msg.msg && <Msg msg={msg} setMsg={setMsg} />}
                <div className={styles.cardInset}>

                    <DeleteForeverIcon onClick={(e) => handleDelete(e, post)}
                        className={deleteStyle}
                    />
                    {post.imageUrl &&
                        <Image src={post.imageUrl}
                            width={600}
                            height={400}
                            className={`aspect-video z-0`}
                            alt={`${post.name}-www.garymasterconnect.com`}
                        />
                    }
                    {updatePost ?

                        <MakeAPostUpdate post={post} setUpdatePost={setUpdatePost} />


                        :
                        <div className="flex flex-row justify-start items-center gap-3 w-1/2 cursor-pointer">
                            <SystemUpdateAltIcon onClick={() => setUpdatePost(true)} sx={{ color: "white" }} />
                            <span className="text-slate-100">update</span>
                        </div>
                    }
                    <h3 className="text-center my-2 mx-auto text-2xl text-white">{post.name}</h3>
                    <p className="text-center my-2 mx-auto text-lg text-white">{post.content}</p>
                    <div className="flex flex-row text-xs gap-3">
                        {date && <small className="font-bold mx-auto">{date}</small>}
                        {post.userId && <small className="font-bold mx-auto">{user && user.name}</small>}
                    </div>
                </div>
            </div>
        </div>
    )
}
