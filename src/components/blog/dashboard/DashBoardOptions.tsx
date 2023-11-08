import React from 'react';
import UserPageHit from "@/components/blog/dashboard/UserPageHit";
import Contact from "@component/comp/Contact";
import type { fileType, postType, userAccountType, userType } from "@lib/Types";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Link from 'next/link';
import { newFile } from '@/lib/fetchTypes';
import { InputContext } from '../../context/InputTypeProvider';
import ProfilePicUploadGet from "@/components/blog/dashboard/ProfilePicUploadGet";
import { GeneralContext } from '../../context/GeneralContextProvider';
import { Button, ButtonBase } from '@mui/material';
import GetLinkHits from "@component/blog/dashboard/GetLinkHits";
// import LikesAndRates from "@component/blog/dashboard/LikesAndRates";
import FileLikesRates from "@component/blog/dashboard/FileLikesRates";
import PostLikesRates from "@component/blog/dashboard/PostLikesRates";
import { useRouter } from "next/navigation";


type mainDashOptionType = {
    userFiles: fileType[],
    account: userAccountType,
    userPosts: postType[],
}

export default function DashBoardOptions({ userFiles, userPosts, account, }: mainDashOptionType) {
    const [contact, setContact] = React.useState<boolean>(false);
    const { setFile, setMsg, msg, setUserFiles } = React.useContext(InputContext);
    const { setUser, user, users, setUserPosts } = React.useContext(GeneralContext);

    const homePage = (user && user.name) ? `/blog/usershomelinks/${user.name.replace(" ", "-")}` : "/blog/usershomelinks/";

    React.useEffect(() => {
        if (!user) return
        const refreshUser = users.find(user_ => user_.id === user.id);
        setUser(refreshUser as userType)
    }, [users]);



    const buttonContact = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
        if (contact) {
            setContact(false);
        } else {
            setContact(true)
        }
    }
    const handleNew = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!(account && account.data)) return
        const userID = user && user.id
        if (!userID) return
        const nFile: fileType | undefined = await newFile(userID);
        if (!nFile) return setMsg({ loaded: false, msg: "not created" });
        setFile(nFile);
        setUserFiles([...userFiles, nFile])

    }


    const buttonContactStyle = contact ? " contactbuttonshow flex flex-col items-center my-2 px-2 " : "contactbuttonhide flex flex-col items-center my-2 px-2";
    const button = "border border-orange-300 px-3 py-auto text-sm rounded-full shadow shadow-orange-500 hover:tracking-wide"
    const button2 = "border border-orange-300 px-3 py-auto text-sm rounded-full shadow shadow-orange-500 flex flex-row flex-wrap gap-2 hover:tracking-wide"
    const button3 = "border border-orange-300 px-3 py-auto text-sm rounded-xl shadow shadow-white flex flex-row flex-wrap gap-2 hover:tracking-wide text-slate-100 bg-black z-1000"


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-3 mx-auto my-2">
            <div className="bg-slate-600 py-4 px-2">
                <h3 className="text-center font-bold underline underline-offset-8 ">Info</h3>
                <div className="h-[2px] w-[100px] bg-orange-700 mx-auto container" />
                <div className="flex flex-col items-center my-2 px-2">
                    <h5 className="text-center">give clients options</h5>
                    <UserPageHit files={userFiles} />
                    <GetLinkHits files={userFiles} />
                </div>
                <div className="flex flex-col my-2 mx-auto justisfy-center items-center">
                    <h3 className="text-center text-xl text-orange-300">Create a post?</h3>
                    <h6 className="text-center text-slate-200">to promote your blog</h6>
                    <Link href={"/posts"}>
                        <button className="buttonmd mt-3 mb-1 bg-slate-800 text-black" style={{ color: "white" }}>makapost</button>
                    </Link>
                </div>
            </div>
            <div className="bg-slate-600 py-4 px-2">
                <h3 className="text-center font-bold cursor-pointer hover:text-blue-800 hover:underline hover:underline-offset-7" onClick={(e) => buttonContact(e)}>
                    <KeyboardDoubleArrowRightIcon sx={{ color: "orange" }} />
                    Contact Us <KeyboardDoubleArrowLeftIcon sx={{ color: "orange" }} />
                </h3>

                <div className={buttonContactStyle}>
                    <Contact account={account} />
                </div>
                <div className="mx-auto w-full flex flex-col items-center">
                    <Link href={homePage}>
                        <Button className={button3} style={{ background: "black", borderRadius: "5%" }}>Home page</Button>
                    </Link>
                </div>
                <div className="flex flex-col justify-center mx-auto items-center h-[30vh] w-full overflow-y-scroll">
                    <div>
                        {userFiles && userFiles.map((userFile, index) => (
                            <React.Fragment key={index}>
                                <FileLikesRates userFile={userFile} />
                            </React.Fragment>
                        ))
                        }
                        {userPosts && userPosts.map((userPost, index) => (
                            <React.Fragment key={index}>
                                <PostLikesRates userPost={userPost} />
                            </React.Fragment>
                        ))
                        }
                    </div>

                </div>
            </div>
            <div className="bg-slate-600 py-4 px-2">
                <h3 className="text-center font-bold">connection</h3>
                <div className="flex flex-col items-center my-2 px-2">
                    <Link href="/blog">
                        <button className={button}>
                            view blogs
                        </button>
                    </Link>
                    <h5 className="text-center my-2">New Blog</h5>
                    <button className={button2} onClick={(e) => handleNew(e)}>
                        <span className="text-white">new </span>
                        <NoteAddIcon sx={{ color: "orange", fontWeight: "bold", ml: 1 }} />

                    </button>
                    <h5 className="text-center">upload profile pic</h5>
                    <ProfilePicUploadGet user={user} />
                </div>
            </div>

        </div>
    )
}
