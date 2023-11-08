import type { Session } from "next-auth";


export type accountType = {
  id: string,
  userId: string,
  type: string,
  provider: string,
  providerAccountId: string,
  refresh_token?: string,
  access_token?: string,
  expires_at?: number,
  token_type?: string,
  scope?: string,
  id_token?: string,
  session_state?: string,
}
export type sessionType = Session

export type userType = {
  id: string,
  name: string,
  email: string,
  emailVerified: Date | null,
  password: string | undefined,
  imgKey:string | undefined,
  bio?:string | undefined,
  image: string | undefined,
  files: fileType[],
  posts:postType[],
  accounts?: accountType[],
  hits?:mainPageHit[]
}
export type userTypeShort = {
  id?: string,
  name: string,
  email: string,
  imgKey:string | undefined,
  bio?:string,
  image: string | undefined,
  files: fileType[],
  posts:postType[],
  
}

export type userAccountType = {
  loaded: boolean,
  data: {
    id: string,
    name: string,
    email: string,
    image: string | null,
    imgKey: string | undefined,
    status: "loading" | "authenticated" | "unauthenticated"
  } | null
}
export type verifyTokenType = {
  identifier: string,
  token: string,
  expires: Date
}
export type registerType = {
  id?: string,
  name: string,
  email: string,
  emailVerified?: Date,
  password: string | null,
  imgKey?:string
}

export type inputType = {
  id?: number,
  name:string,
  content: string,
  url:string | null,
  type:string,
  s3Key:string | null
  fileId:string 
  date?:Date
}
export type msgType={
  loaded:boolean,
  msg:string
}
export type inputNameType = {
  nameType:"title"| "summary"|"section"|"heading"|"subHeading"| undefined
}
export type likepostType={
  id?:number,
  name:string,
  postId:number
}
export type ratefileType={
  id?:number,
  rate:number,
  fileId:string
}
export type ratepostType={
  id?:number,
  rate:number,
  postId:number
}
export type likefileType={
  id?:number,
  name:string,
  fileId:string
}
export const arrLikeType=[
  {name:"avg"},
  {name:"great"},
  {name:"loveit"},
  {name:"poor"},
  {name:"amazed"},

]
export type fileType = {
  id: string,
  name: string,
  date:Date,
  title:string,
  published:boolean,
  content:string,
  userId:string,
  fileUrl:string,
  imageKey:string | null,
  imageUrl:string | null,
  inputTypes:inputType[],
  likes:likefileType[],
  rates:ratefileType[]
}
export type postType={
  id:number,
  name: string,
  content:string,
  imageUrl:string | null,
  s3Key: string | null,
  bloglink:string | null,
  date: Date,
  userId:string,
  likes:likepostType[],
  rates:ratepostType[]
}
export const inputArr: inputArrType = ["select", "title", "summary", "section", "heading", "subHeading","conclusion","image","link","question","list"];

export type mainPageHit = {
  id?: number;
  page: string ;
  count?: number ;
  date?: Date | string;
  name:string
}
export type navImageLinkType={
  id:number,
  icon:React.ReactElement,
  name:string,
  image:string
  link:string,
  desc:string
}
export type linkType={
  id?:number
  url:string,
  count?:number,
  subject?:string
  content?: string
  fileId:  string,
  inputId: number
}
export type gets3ImageType={
  imageUrl: string;
    key: string;
    msg: mediaType;
    imageObj: inputType;
}
export type gets3ProfilePicType={
  imageUrl: string;
    key: string;
}
export type upload3ProfilePicType={
  msg: string;
    key: string;
}

 export interface BlogpostType {
id:string,
title:string,
date:string
}
 export interface BlogStoreType{
id:string,
title?:string,
date:string
}
export type paramsType = {
    id:string,
    filename:string,
    heading?: string,
    summary?:string,
    summary2?:string,
    subheading?: string,
    section?: string,
    heading2?: string,
    subheading2?: string,
    section2?: string,
    name:string,
    date: string
}

export type htmlDirsType={
    id:string,
    filename:string,
}
export type fetchFilesType={
    htmlDirs:htmlDirsType[] 
    status:number,
    message:string 
}

export type IDCollectorType={
    targetIDs:string[],
    id:string
}

export type inputArrType = string[]


export type contentType = {
    id?: string ,
    name:string,
    input: string,
    targetID: string
  }

  export type dateType = {
    id: string,
    date: string,
  
  }
 
 
  export type imageType = {
    name: string, //This has id-imageName
    url:string,
    alt:string,
    type:string
} 
 
  export type masterfileType = {
    id: string,
    file:fileType,
    inputtypes:inputType[]
  }
 

  export type fetchAllType = {
    data: { 
      id: string,
       filename: string,
       content:string
     }[],
    message: string
}
export type fetchSingleFileType={
   id: string,
   filename: string,
   content: string,
   status: number 
} 
export type fetchSingleWrapType={
   message:string,
   data:fetchSingleFileType
}
export type mediaType ={
  loaded:boolean,
  message:string
}
export type propCompareType={
  key:string,
  subject:string,
  value:string
}
export type contactType={
  id: number,
  subject: string,
  content: string,
  email?:string,
  userId:  string
}
export type dataType={
  name:string,
  link:string,
  desc:string
}
export type dataReplyType={
  id: number,
  subject: string,
  content: string,
  email?: string,
  userId:  string
}
export type genInfoType={
  id:number,
  category:string,
  name:string,
  url:string,
  desc:string
}
export type s3mediaType={
  url:string,
  Key:string
}
