import type { Metadata, ResolvingMetadata } from 'next';
import axios from 'axios';
import { userType } from '@/lib/Types';
//NOT BELOW=> IT CAN NOT BE IMPORTED INTO A PAGE LIKE STATIC, , THE CODE MUST BE ON THE PAGE.AND!! THE FUNCTION NAME-generateMetadata() CAN NOT BE CHANGED
type Props = {
    params: { username: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const username = params.username

    // fetch data
    const user_name = username.replace("-", "")
    const { data } = await axios.get(`/api/getusermeta?username=${user_name}`);
    const body: userType | undefined = data;
    const image = (body && body.image) ? body.image : "/images/gb_logo.png"


    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${user_name}- Blog Room Page`,
        description: body?.bio,
        openGraph: {
            images: [image, ...previousImages],
        },
    }
}

