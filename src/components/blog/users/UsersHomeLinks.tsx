"use client";
import React from 'react';
import { userType } from "@lib/Types";
import Image from 'next/image';
import Button from "@component/comp/Button"
import Link from 'next/link';
import { GeneralContext } from '@context/GeneralContextProvider';
import { usePathname } from "next/navigation";
import { getUsers } from "@lib/fetchTypes";
import UserHomeItem from "@component/blog/users/UserHomeItem"

type usersTypes = {
    getusers: userType[] | undefined,
}
export default function UsersHomeLinks() {
    const { setPageHit, setGetError, setUsers, users } = React.useContext(GeneralContext);
    const pathname = usePathname();
    const logo = "/images/gb_logo.png";
    const custGrid3 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:container mx-auto gap-4 px-1 sm:px-0";
    const custGrid2 = "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:container mx-auto";
    const custGrid1 = "grid grid-cols-1 lg:container mx-auto";
    const custGrid = (users && users.length > 2) ? custGrid3 : custGrid2;

    React.useMemo(async () => {
        const getusers = await getUsers();
        if (!getusers) {
            return setGetError("no users from api/user")
        } else {
            setUsers(getusers);
        }
    }, [setUsers, setGetError]);


    React.useEffect(() => {
        if (!pathname) {
            return setGetError("did not get pathname@UsersHomeLinks")
        }
        setPageHit({ page: pathname, name: "none" });
        if (window.scrollY) {
            window.scroll(0, 0);
        }
    }, [pathname, setPageHit, setGetError]);


    if (users) {
        return (
            <div className={custGrid}>
                {
                    users.map((user, index) => (
                        <React.Fragment key={index}>
                            <UserHomeItem user={user} />
                        </React.Fragment>
                    ))
                }
            </div>
        )
    } else {
        <div className="flex flex-col items-center justify-center lg:container mx-auto">
            <h3 className="text-center text-2xl font-bold">...loading</h3>
        </div>
    }
}
