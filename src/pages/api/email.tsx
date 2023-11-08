import { transporter, mailOptions } from "@component/emails/nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import type { contactType } from "@lib/Types";


const generateText = (subject: string, email: string, authorBio: string | null) => {
    return (
        `<h1>Community member</h1>
    <br>
    <h4>${subject}</h4>
    <p>We are always updating our free services and will let you know when, new services are available</p>
    <p>We will email as soon as new services become available to your email @: ${email}</p>
    <br>
    <br>
    <p> ${authorBio && authorBio}/p>
    <a href="www.masterconncet.ca">master connect</a>
    <p>email: masterultils@gmail.com</p>`
    )
}
export const generateHTML = (content: string, email: string, subject: string, authorBio: string | null) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You've signed up</title>
            <style>
                body{
                    border-radius:10px;
                    box-shadow:1px 1px 5px 20px grey,-1px -1px -5px 20px grey;
                }
                h4{
                    color:blue;
                }
                h1{ font:"bold";text-decoration:underline;text-underline-offset: 3;}
                .masterultils{
                    background:whitesmoke;
                    margin-block:20px;
                    padding-block:20px;
                    border-radius:10%;
                    width:30%;
                    padding:2rem;
                    text-align:left;
                    box-shadow:1px 1px 20px 2px grey,-1px -1px 20px 2px grey;
                }
                p{margin-block:10px}
                .list{
                    margin-block:20px;
                    background:white;
                    border-radius:10px;
                    padding:7px;
                    box-shadow:1px 1px 5px 20px grey,-1px -1px -5px 20px grey;
                }
                img{
                    border-radius:50%;
                    padding:1rem;
                    box-shadow: 2px 2px 10px 2px black,-2px -2px 10px 2px black;
                }
            </style>
        </head>
        <body>
            <h1>Community member</h1>
            <br>
            <h4>subject: ${subject}</h4>
            <p>We are always improving our free service and will let you know when, new services or improvements are available</p>
            <p>We will email as soon as new services or improvements become available to your email @: ${email}</p>
            <h3>sent content</h3>
            <p style="margin-inline:1rem;padding-inline:0.5rem;line-height:0.5rem;">${content}</p>
            <br>
            <h3 style=margin-bottom:1.5rem;> about the author </h3>
                <p style="margin-inline:1rem;line-height :0.6rem; padding-inline:1em;">
                ${authorBio && authorBio}
                </p>
            <br>
            <h4> additional interesting things you might like</h4>
            <ul class="list">
                <li><a href="https://www.masterultils.com/articles">articles</a></li>
                <li><a href="https://www.masterultils.com/contact">Contact Us</a></li>
                <li><a href="https://www.masterultils.com/register">register</a></li>
                <li><a href="https://www.masterconnect.ca/design">Our Designs</a></li>
                <li><a href="https://www.garymasterconnect.com">Free peronalize blogs</a></li>
            </ul>
            
            <div class="masterultils text-align-center flex-col items-center gap-2">
            <a href="www.masterconncet.ca">master connect</a>
            <p>email: masterultils@gmail.com</p>
                <img src="https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/logo.png" alt="www.masterconnect.ca"
                
                />
            </div>
        </body>
        </html>
    `
    )
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const data = req.body;
        if (!(data.email && data.userId)) {
            res.status(302).json({ message: "I think you forgot something" })
        }
        try {
            const author = await prisma.user.findUnique({
                where: {
                    id: data.userId
                }
            });
            if (author) {
                const add_data = await prisma.contact.upsert({
                    create: {
                        subject: data.subject,
                        content: data.content,
                        email: data.email,
                        userId: data.userId
                    },
                    update: {
                        subject: data.subject,
                        content: data.content,
                        email: data.email,
                        userId: data.userId
                    },
                    where: {
                        email: data.email
                    }

                });
                if (add_data && add_data.subject && add_data.email) {
                    await transporter.sendMail({
                        ...mailOptions(add_data.email, [author.email]),
                        subject: `Thank you for contacting us!`,
                        text: generateText(add_data.content, add_data.email, author.bio),
                        html: generateHTML(add_data.content, add_data.subject, add_data.email, author.bio)
                    });
                    await prisma.$disconnect();
                    return res.status(200).json({ message: "sent" });
                }

            }
        } catch (error: any) {
            console.log(error)
            res.status(400).json({ message: error.message })
        } finally {
            await prisma.$disconnect();
        }
    }
    res.status(400).json({ message: "Bad request" })
}
export default handler;