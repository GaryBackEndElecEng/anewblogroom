"use client"
import React from 'react';
import Image from "next/image";
import { inputType, fileType, linkType } from "@lib/Types";
import { InputContext } from "@context/InputTypeProvider";
import QuestReply from "@component/comp/QuestReply";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { getLinks, storeLinks } from '@/lib/fetchTypes';




type mainHeader = {
    input: inputType
}
type mainFileType = {
    file: fileType
}


export function ListComp({ input }: mainHeader) {
    const subject = "list";
    const show = input.name === subject ? true : false;
    const listitem = show ? input : null;

    const formStyle = "listform flex flex-col w-full sm:w-3/4 my-2 px-3 mx-auto relative bg-white text-black justify-center items-center ";
    const container = show ? "listContainer flex flex-col justify-center items-center w-full relative  my-2 mb-3" : "hidden"


    return (
        <div className={container} style={{ marginBottom: "3rem" }}>
            <div className="flex flex-col mx-auto justify-center items-center  mt-2 w-full px-3 py-2  " >

                {listitem && show &&
                    <div className="mx-auto list  w-full prose prose-md" style={{ color: "white", font: "bold" }}>
                        <ConvertToList para={listitem.content} />
                    </div>
                }
            </div>
        </div>
    )
}

function ConvertToList({ para }: { para: string }) {
    // searchList

    const numLis: RegExp = /[0-9]+./gm; //This matches 1.),2.),,etc
    const hyphen: RegExp = /-/gm; //matches "-"
    const endHyphen: RegExp = /;/gm; //matches ";"
    const nextLine: RegExp = /\n/gm; //matches "return"
    const searchList = [
        { name: "hyphen", match: hyphen, repl: `<li>  ` },
        { name: "num", match: numLis, repl: `<li>$&  ` },
        { name: "endHyphen", match: endHyphen, repl: "</li>" },
        { name: "endHyphen", match: nextLine, repl: "</li>" },
    ]
    let para2: string = "";
    const getResults = searchList.map((item, index) => {
        if (index === 0) {
            para2 = para
        }
        para2 = para2.replace(item.match, item.repl)
        return `<ul>${para2}</u>`
    });
    const results = getResults[getResults.length - 1]
    return (<div dangerouslySetInnerHTML={{ __html: results }} />)


}

export function separatePara(para: string, class_: string) {
    const arr = para.split("\n");
    var retArr: React.JSX.Element[] = []
    if (arr) {
        retArr = arr.map((pg: string, index) => {
            return (
                <p className={class_} key={index}>{pg}</p>
            )
        });
    }
    return retArr
}

export function ParagraphCreator({ content, name }: { content: string, name: string }) {
    const [styleName, setStyleName] = React.useState<string>(name)
    React.useEffect(() => {
        if (name === "summary") return setStyleName("summary");
        if (name === "section") return setStyleName("section");
        if (name === "conclusion") return setStyleName("conclusion");
        if (name === "file") return setStyleName("summary");
    }, [name]);

    if (!content) return
    let arr: string[] = content.split("");
    let para: string[] = [];
    let i = 0;
    let j = 0;
    const check: boolean = arr.find(lett => (lett === "\n")) ? true : false;
    if (check) {
        arr.forEach((char, index) => {
            if (char === "\n") {
                i = index;
                const paragraph: string = arr.slice(j, index).join("")
                para.push(paragraph)
                j = i;
            }
        });
    }

    const paraStyle = ` ${styleName} px-3 m-auto my-3 text-white prose prose-xl leading-[3rem]`
    return (
        <>
            {check ? para && para.map((parag, index) => (
                <React.Fragment key={index}>
                    <p className={paraStyle}>{parag}</p>
                </React.Fragment>
            ))
                :
                <p className={paraStyle}>{content}</p>
            }
        </>
    )
}

export const list_: { nameType: string, item1: string, item2: string, item3: string }[] = [
    { nameType: "container", item1: "lg:container mx-auto my-3 relative flex flex-col items-center gap-3", item2: "", item3: "" },
    { nameType: "h3", item1: "mx-auto text-center text-xl", item2: "", item3: "" },
    { nameType: "h2", item1: "mx-auto text-center text-2xl underline underline-offset-8", item2: "", item3: "" },
    { nameType: "h1", item1: "mx-auto text-center text-3xl underline underline-offset-8", item2: "", item3: "" },
    { nameType: "flexRow", item1: "mx-auto flex flex-row justify-start items-start gap-3", item2: "mx-auto flex flex-row justify-evenly items-start gap-3", item3: "mx-auto flex flex-row justify-evenly items-center gap-3" },
    { nameType: "subHeading", item1: "mx-auto text-center text-xl", item2: "text-center text-xl text-white font-bold my-2", item3: "" },
    { nameType: "heading", item1: "mx-auto text-center text-2xl", item2: "text-white prose prose-md my-2 mx-auto p-2", item3: "" },
    { nameType: "title", item1: "mx-auto text-center text-3xl underline underline-offset-8", item2: "", item3: "" },
    { nameType: "section", item1: "mx-auto flex flex-col justify-start items-center gap-2 w-full", item2: "text-white prose prose-md my-2 mx-auto p-2", item3: "" },
    { nameType: "summary", item1: "mx-auto flex flex-col justify-start items-center gap-2 w-full", item2: "text-white prose prose-md my-2 mx-auto p-2", item3: "" },
    { nameType: "conclusion", item1: "mx-auto flex flex-col justify-start items-center gap-2 w-full", item2: "text-white prose prose-md my-2 mx-auto p-2", item3: "" },
    { nameType: "msg", item1: "flex flex-col justify-center items-center", item2: "", item3: "" },
    { nameType: "msgAbs", item1: "absolute top-[5%] inset-y-0 w-full lg:w-1/4 h-[10vh] flex flex-col justify-center items-center", item2: "", item3: "" },
    { nameType: "msgFalse", item1: "text-center text-red-800 font-bold prose prose-xl text-xl m-auto", item2: "", item3: "" },
    { nameType: "msgTrue", item1: "text-center text-white prose prose-xl font-bold text-xl m-auto", item2: "", item3: "" },
    { nameType: "default", item1: "text-center text-white text-xl mx-auto", item2: "", item3: "" },
];

export const type_ = (name: string) => {
    const result = list_.filter(item => {
        if (name === item.nameType) {
            return item
        }
        return list_.find(item => (item.nameType === "default"))
    })[0];
    if (result) return result
    return
};



export function ImageJsx({ input }: mainHeader) {
    if (input && input.url && input.s3Key) {
        return (
            <div className="lg:prose lg:prose-xl mx-auto ">
                {input.url &&
                    <Image src={input.url} alt={input.content} width={900} height={600} className="aspect-video rounded-lg p-2 w-full my-3 mb-4" />
                }
            </div>
        )
    }
}

export function Conclusion({ input }: mainHeader) {
    const show = (input && input.name === "conclusion") ? true : false;
    const section = "conclusion mx-auto flex flex-col justify-start items-center gap-2 w-full";
    const showPara = "text-white prose prose-md my-2 mx-auto p-2 indent-2.5";
    const inputStyle = type_(input.name);
    const sectionDisplay = show ? section : " hidden";
    const para = showPara;
    const text_ = input.content as string

    return (
        <section className={sectionDisplay}>
            <h1 className="text-2xl text-center text-orange-900 font-bold mb-2"> CONCLUSION</h1>
            <ParagraphCreator content={input.content} name={input.name} />
        </section>

    )
}

export function Heading({ input }: mainHeader) {
    const check = (input.name === "title" || input.name === "heading") ? true : false
    const show = check ? true : false;
    const heading = show ? input : null;
    // console.log("SHOW", show, input.name)
    const title = " title mx-auto text-center text-4xl underline underline-offset-8 mb-4";
    const headingStyle = " heading mx-auto text-center text-3xl mb-3";

    const showPara = (heading && heading.name === "title") ? title : (heading && heading.name === "heading" ? headingStyle : "");
    const para = show ? showPara : "hidden";
    const text_ = heading && heading.content.toUpperCase() as string
    if (input.name === "title") {
        return (
            <>
                {heading && <h3 className={para} id={String(String(heading.id))}>{heading && text_ && text_}</h3>}
            </>
        )
    } else {
        return (
            <>
                {heading && <h3 className={para} id={String(heading.id)}>{heading.content}</h3>}
            </>
        )
    }
}
export function SubHeading({ input }: mainHeader) {
    const show = (input && input.name === "subHeading") ? true : false;
    const subHeading = show ? input : null;
    const subHeadingStyle = "subHeading mx-auto text-center text-2xl font-bold"
    const h3 = show ? subHeadingStyle : "hidden";
    return (
        <>
            {subHeading && <div className={h3} id={String(subHeading.id)}>{subHeading.content}</div>}
        </>
    )
}
export function HLink({ input }: mainHeader) {
    const { setMsg, msg, getlinks, setGetlinks } = React.useContext(InputContext);
    const show = (input && input.name === "link") ? true : false;
    const hlink: inputType | null = show ? input : null;

    const matchedLink = React.useCallback(async () => {
        let updateLnk: linkType | undefined;
        const get_links = await getLinks();
        if (!get_links || !hlink) return;
        setGetlinks(get_links);
        updateLnk = await storeLinks(get_links, hlink);
        if (!updateLnk || !updateLnk.id) return
        const redLinks = get_links.filter(lnk => (lnk.id !== (updateLnk ? updateLnk.id : 0)));
        setGetlinks([...redLinks, updateLnk])
        return updateLnk
    }, [hlink, setGetlinks]);

    const handleLink = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const matchLnk = await matchedLink()
        if (window && matchLnk) {
            window.open(matchLnk.url, "blank")
        }

    }


    const linkStyle = "hlink mx-auto text-center text-white font-bold decoration-dash shadow shadow-grey-400 p-2 rounded-lg prose prose-lg underline underline-offset-[0.25rem] hover:text-blue-900";
    const hlinkStyle = "link mx-auto text-center text-xl font-bold underline underline-offset-4"
    const h_link = show ? hlinkStyle : "hidden";
    return (
        <div className="mx-auto lg:container flex flex-col items-center justify-center">
            {hlink && <div id={String(hlink.id)}
                className={linkStyle}
                onClick={(e) => handleLink(e)}
            >
                {hlink.content && hlink.content}
            </div>}
        </div>

    )
}
export function Summary({ input }: mainHeader) {
    const show = (input && input.name === "summary") ? true : false;
    const summary = show ? input : null;
    const summary__ = "summary mx-auto flex flex-col justify-start items-center gap-2 w-full my-3"
    const sectionDisplay = show ? summary__ : "hidden";
    const para = "text-white prose prose-md my-2 mx-auto p-2 indent-2.5";
    const text_ = input.content as string
    // console.log(input)
    return (
        <section className={sectionDisplay} id={String(input.id)}>
            {summary && <ParagraphCreator content={summary.content} name={summary.name} />}
        </section>
    )
}

export function Section({ input }: mainHeader) {
    const show = (input && input.name === "section") ? true : false;
    const sectionOb = show ? input : null;
    const section__ = "section mx-auto flex flex-col justify-start items-center gap-2 w-full my-3"
    const sectionDisplay = show ? section__ : "hidden";
    const para = "text-white prose prose-md my-2 mx-auto p-2 indent-2.5";
    const text_ = input.content as string
    const paragraphs = separatePara(text_, para)
    return (
        <section className={sectionDisplay} id={String(sectionOb ? sectionOb.id : "section id")}>
            {sectionOb && <ParagraphCreator content={sectionOb.content} name={sectionOb.name} />}
        </section>
    )
}
export function FileContent({ file }: { file: fileType | null }) {
    if (!file) return
    const title = " title mx-auto text-center text-4xl lg:text-6xl underline underline-offset-8 mb-4";
    const para = file.title ? title : "hidden";
    const upper = file.title ? file.title.toUpperCase() : "";

    return (
        <React.Fragment>
            <h2 className={para}>{upper}</h2>
            {file && file.imageUrl && <Image src={file.imageUrl} width={800} height={600} alt={file.name}
                className="aspect-video p-2 my-2"
            />}
            <section className="section px-3 mx-auto my-3 mt-4">
                <ParagraphCreator content={file.content} name={"file"} />
            </section>
        </React.Fragment>
    )
}

export function Question({ input }: mainHeader) {

    const subject = 'question';
    const [openReply, setOpenReply] = React.useState<boolean>(false);
    const show = (input.name === subject) ? true : false;
    const question: inputType | null = show ? input : null;
    const { file } = React.useContext(InputContext);

    const handleReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!openReply) {
            setOpenReply(true);
        } else {
            setOpenReply(false);
        }
    }

    const container = show ? "container mx-auto flex flex-col gap-2 w-full items-center justify-start flex-1" : "hidden";
    const textSection = " form text-black bg-white p-3 w-full shadow shadow-orange-900 rounded-xl flex-1"
    const setSectionInput = "mx-auto flex flex-col justify-start items-center gap-2 w-full";
    const setSectionDisplay = "question mx-auto flex flex-col justify-start items-center gap-2 w-full flex-1 relative";
    const para = "question text-white prose prose-lg text-xl my-2 mx-auto p-2";
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4 cursor-pointer";
    const openReplyStyle = openReply ? "flex flex-col justify-center items-start h-[40vh] w-full sm:w-3/4 lg:w-1/2 " : "flex flex-col justify-center"
    const quoteBlockStyle = "flex flex-col justify-center items-start"

    return (

        <div className={container}>
            <section className={setSectionDisplay}>
                <p className={para}>{question && question.content && question.content}</p>
                <div className={quoteBlockStyle}>
                    <blockquote className="my-2 mx-auto">
                        {openReply ?
                            (
                                <button className={button} onClick={(e) => handleReply(e)}>
                                    close <CloseIcon sx={{ ml: 1, color: "red" }} />
                                </button>
                            )
                            :
                            (
                                <button className={button}

                                    onClick={(e) => handleReply(e)}>
                                    <span>reply</span> <SendIcon sx={{ color: "orange", ml: 1 }} />
                                </button>
                            )
                        }
                    </blockquote>
                </div>
                {openReply &&
                    <div className={`${openReplyStyle} relative`}>
                        <QuestReply input={question} openReply={openReply} setOpenReply={setOpenReply} />
                    </div>
                }
            </section>

        </div>

    )
}



