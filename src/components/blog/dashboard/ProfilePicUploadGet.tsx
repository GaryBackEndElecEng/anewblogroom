import React from 'react';
import type { userType, gets3ProfilePicType, upload3ProfilePicType } from "@lib/Types";
import { uploadProfileToS3 } from "@lib/s3ApiComponents";
import { GeneralContext } from '@context/GeneralContextProvider';
import { Button } from "@chakra-ui/react";
import Image from 'next/image';
import { getS3User, saveUser } from "@lib/fetchTypes";

type mainType = {
    user: userType | null
}
export default function ProfilePicUploadGet({ user }: mainType) {
    const imgKey = (user && user.imgKey) ? user.imgKey : null;
    const imageUrl = (user && user.image) ? user.image : undefined
    const { setUser } = React.useContext(GeneralContext);
    const [Key, setKey] = React.useState<string | null>(imgKey);
    const [s3Image, setS3Image] = React.useState<string | undefined>();
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (s3Image && !(user && user.imgKey)) return
        if (!user?.image) return
        setS3Image(user.image)
    }, [user, setS3Image, s3Image]);

    React.useEffect(() => {
        if (!Key) return

        const getImage = async (user: userType) => {
            const newUser: userType | undefined = await getS3User(user);
            if (!newUser) return
            setUser(newUser);
            setS3Image(imageUrl);
        }
        if ((user && !(user.image))) {
            getImage(user as userType)
        }
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.currentTarget.files) return
        const fileImg = e.currentTarget.files[0]
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)

    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return
        setIsLoading(true)
        const body = await uploadProfileToS3(e, user) as gets3ProfilePicType | undefined
        if (!body) return null
        const { key, imageUrl } = body
        const modUser = { ...user, imgKey: key, image: imageUrl }
        setKey(key);
        const newUserWithimg = await saveUser(modUser)
        if (!newUserWithimg) return
        setUser(newUserWithimg)
        setIsLoading(false)
        setTempImg(null)

    }
    const cirImage = "border border-white shadow shadow-blue-300 p-1 rounded-full"
    return (
        <div className="flex flex-col items-start justify-evenly">
            <form action="" onSubmit={handleSubmit}
                className="flex flex-row flex-wrap justify-around items-center gap-3 text-xs"
            >
                <label htmlFor="file" className="text-xs">pic upload</label>
                <input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />

                <Button isLoading={isLoading} colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isLoading}  >up load</Button>
                :
                <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
            </form>

            <div className="flex flex-col justify-center items-center">
                {(tempImg && !s3Image) ?
                    (
                        <Image src={tempImg} width={75} height={75} alt="www.garymasterconnect.ca" className={cirImage} />
                    )
                    :
                    s3Image && (
                        <Image src={s3Image} width={75} height={75} alt="www.garymasterconnect.ca" className={cirImage} />
                    )
                }
            </div>
        </div>
    )
}
