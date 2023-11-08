import React from 'react'
type mainType = {
    content: string | null,
    subject: string | undefined
}
export default function ParagraphCreator({ content, subject }: mainType) {

    if (!content) return (<></>)
    let arr: string[] = content.split("");
    let para: string[] = [];
    let i = 0;
    let j = 0;
    arr.forEach((char, index) => {
        if (char === "\n") {
            i = index;
            const paragraph: string = arr.slice(j, index).join("")
            para.push(paragraph)
            j = i;
        }
    });

    const paraStyle = `${subject ? subject : ""} paraCreator paraStyle px-3 m-auto my-2 text-white prose prose-xl leading-8`
    return (
        <>
            {para && para.map((parag, index) => (
                <React.Fragment key={index}>
                    <p className={paraStyle}>{parag}</p>
                </React.Fragment>
            ))}
        </>
    )
}
