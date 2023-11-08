"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { userType, msgType, userAccountType, registerType } from "@lib/Types";
import { GeneralContext } from "@component/context/GeneralContextProvider";
import { uploadProfileToS3 } from "@lib/s3ApiComponents";
import UploadDisplayPic from "@component/register/UploadDisplayPic";
import { ArrowFunction, FunctionDeclaration } from 'typescript';
import Link from 'next/link';
import axios from 'axios';

type mainRegisterType = {
    genHash: (pswd: string) => Promise<string>
}
function textPswd(pswd: string): boolean {
    const pswdTest = /(?=^.{5,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g;
    if (pswdTest.test(pswd)) return true
    return false

}

const Register = ({ genHash }: mainRegisterType) => {

    const { setAccount, session, status, setUser, user } = React.useContext(GeneralContext);
    const staticImage = process.env.NEXT_PUBLIC_aws;
    const logo = `${staticImage}/logo.png`;
    const router = useRouter();
    const [Data, setData] = React.useState<userType>({} as userType);
    const [msg, setMsg] = React.useState<msgType | null>(null);
    const [showPass, setShowPass] = React.useState<boolean>(false);
    const [pswd, setPswd] = React.useState<string>("");
    const changePasswd = () => {
        setShowPass(true);
        setTimeout(() => { setShowPass(false) }, 2000);
    }


    React.useMemo(async () => {
        if (textPswd(pswd)) {
            let tempPswd: string | null = await genHash(pswd);
            if (tempPswd) {
                setData({ ...Data, password: tempPswd, emailVerified: new Date() });
                setMsg({ loaded: true, msg: "Thank you for joining" })
            }
        } else {
            setMsg({ loaded: false, msg: "password is at least 5 letters long with one uppercase and one !,^,?,,special character" })
        }
    }, [pswd]);

    const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sendRegister = async () => {


            try {
                const { data } = await axios.post(`api/register`, Data);
                console.log(data)
                const body: userType = data as userType;
                setMsg({ loaded: true, msg: "logged in" })
                setUser(body);
                const temp: userAccountType = {
                    loaded: true,
                    data: {
                        id: body.id,
                        name: body.name as string,
                        email: body.email as string,
                        image: body.image ? body.image : null,
                        imgKey: Data.imgKey ? body.imgKey : undefined,
                        status: "authenticated"
                    }
                }
                setAccount(temp);
                localStorage.setItem("account", JSON.stringify(temp))
                setMsg({ loaded: true, msg: `${body.name} have been registered` });

                router.push("/api/auth/signin");

            } catch (error) {
                throw new Error(" DID NOT REGISTER")
            }
        }
        if (textPswd(pswd) && !showPass) {
            sendRegister();
        }
    }

    const upLoadPic = `${Data.name ? "opacity-100" : "opacity-0"} mx-auto flex flex-col items-center justify-end my-1 mt-4 max-w-[250px]`

    return (

        <div className="flex flex-col w-full sm:max-w-md  justify-center  py-12 lg:px-8 border border-black rounded-lg bg-black text-white">
            <div className="sm:mx-auto px-8 sm:max-w-sm">
                <Image width={155} height={155} src={logo} alt="www" className="mx-auto h-10 w-auto shadow-lg shadow-blue rounded-full" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-grey-900">Register</h2>
                <h3 className="mt-5 text-center text-xl font-bold leading-9 tracking-tight text-grey-900">Thank you for being with us</h3>

            </div>
            <div className="mx-auto">
                {msg && !msg.loaded ?
                    <div className="flex flex-col px-1 my-1 max-w-xs ">
                        <p className=" text-center text-red px-1 text-xs">{msg && msg.msg}</p>
                    </div>
                    :
                    <div className="flex flex-col px-auto my-3 min-w-sm ">
                        <p className="text-lg text-center text-blue">{msg && msg.msg}</p>
                    </div>
                }
            </div>
            <div className={upLoadPic}>
                <UploadDisplayPic setData={setData} Data={Data} />
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={(e) => registerUser(e)} className="w-full flex flex-col items-center  p-3 rounded-lg bg-slate_blue text-white shadow-md shadow-slate_blue text-lg gap-2" >

                    <label htmlFor="name" className="block text-sm font-medium leading-6">name</label>

                    <input type="text" className="mt-2 shadow shadow-blue bg-white text-black rounded-lg w-full px-3"
                        name="name"
                        id="name"
                        value={Data && Data.name ? Data.name : ""}
                        onChange={(e) => setData({ ...Data, name: e.target.value })}
                        required

                    />

                    <label htmlFor="email" className="block text-sm font-medium leading-6">email</label>

                    <input className="mt-2 shadow shadow-blue bg-white text-black rounded-lg  w-full px-3"
                        name="email"
                        id="email"
                        type="email"
                        value={Data && Data.email ? Data.email : ""}
                        onChange={(e) => setData({ ...Data, email: e.target.value })}
                        required

                    />

                    <label htmlFor="password" className="block text-sm font-medium leading-6">password</label>

                    <input className="mt-2 shadow shadow-blue bg-white text-black rounded-lg  w-full px-3"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={pswd}
                        required
                        onChange={(e) => setPswd(e.target.value)}

                    />
                    <button className="text-center text-white bg-blue shadow-md shadow-blue rounded-md hover:text-leading-3 my-3 mb-3" onClick={changePasswd}>show pswd</button>


                    <div className="flex flex-col items-center">
                        <button type="submit" className="flex flex-col w-full justify-center rounded-md bg-indigo-600 px-4 py-1 5 text-sm font-bold text-center shadow-md shadow-white">submit</button>
                    </div>
                </form>

                <div className="flex flex-col items-center justify-end mt-5">
                    <Link href={"/api/auth/signin"}
                        className="m-auto text-center mt-3 dark:bg-white bg-blue text-white dark:text-white shadow-md shadow-white border border-white rounded-full px-3"
                    >
                        signin
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default Register