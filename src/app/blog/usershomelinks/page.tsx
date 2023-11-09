
import React from 'react'
import { getUsers } from "@lib/fetchTypes";
import UsersHomeLinks from "@/components/blog/users/UsersHomeLinks";

export default async function homelinks() {
    // const get_users = await getUsers();
    return (
        <div>
            <UsersHomeLinks />
        </div>
    )
}
