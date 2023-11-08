"use client"
import React from 'react';
import { addInput, getLinks } from "@lib/fetchTypes";
import { updateFile } from "@lib/generalFunc";
import { v4 as uuidv4 } from 'uuid';
import { saveToStorage } from '@/lib/storePullLocStorage';
import { inputType, dateType, fileType, msgType, IDCollectorType, inputArrType, masterfileType, inputArr, linkType } from "@lib/Types";
import { getErrorMessage } from '@/lib/errorBoundaries';


type inputContextType = {
  setMsg: React.Dispatch<React.SetStateAction<msgType>>,
  msg: msgType,
  setAllFiles: React.Dispatch<React.SetStateAction<fileType[]>>
  allFiles: fileType[],
  setUserFiles: React.Dispatch<React.SetStateAction<fileType[]>>
  userFiles: fileType[],
  setFile: React.Dispatch<React.SetStateAction<fileType | null>>,
  file: fileType | null,
  setFilename: React.Dispatch<React.SetStateAction<inputType>>,
  filename: inputType,
  setTitle: React.Dispatch<React.SetStateAction<inputType>>,
  title: inputType,
  setSubTitle: React.Dispatch<React.SetStateAction<inputType>>,
  subTitle: inputType,
  setHeading: React.Dispatch<React.SetStateAction<inputType>>,
  heading: inputType,
  setSummary: React.Dispatch<React.SetStateAction<inputType>>,
  summary: inputType,
  setSubHeading: React.Dispatch<React.SetStateAction<inputType>>,
  subHeading: inputType,
  setSection: React.Dispatch<React.SetStateAction<inputType>>,
  section: inputType,
  setDate: React.Dispatch<React.SetStateAction<dateType>>,
  date: dateType,
  setIDCollector: React.Dispatch<React.SetStateAction<IDCollectorType>>,
  IDCollector: IDCollectorType,
  inputArr: inputArrType,
  setMasterFile: React.Dispatch<React.SetStateAction<masterfileType>>,
  masterFile: masterfileType,
  setGetComponents: React.Dispatch<React.SetStateAction<msgType>>,
  getComponents: msgType,
  setSaved: React.Dispatch<React.SetStateAction<msgType>>,
  saved: msgType,
  setInput: React.Dispatch<React.SetStateAction<inputType>>,
  input: inputType,
  setSelect: React.Dispatch<React.SetStateAction<string | null>>,
  select: string | null,
  setGetlinks: React.Dispatch<React.SetStateAction<linkType[] | null>>,
  getlinks: linkType[] | null,
  newFileAndInputControlPoint(select: string, file: fileType): Promise<fileType | undefined>

}

export const InputContext = React.createContext<inputContextType>({} as inputContextType)

export default function InputTypes(Props: any) {
  const [file, setFile] = React.useState<fileType | null>(null);
  const [allFiles, setAllFiles] = React.useState<fileType[]>([]);
  const [userFiles, setUserFiles] = React.useState<fileType[]>([]);
  const [filename, setFilename] = React.useState<inputType>({} as inputType);
  const [input, setInput] = React.useState<inputType>({} as inputType);
  const [title, setTitle] = React.useState<inputType>({} as inputType);
  const [subTitle, setSubTitle] = React.useState<inputType>({} as inputType);
  const [heading, setHeading] = React.useState<inputType>({} as inputType);
  const [summary, setSummary] = React.useState<inputType>({} as inputType);
  const [subHeading, setSubHeading] = React.useState<inputType>({} as inputType);
  const [section, setSection] = React.useState<inputType>({} as inputType);
  const [date, setDate] = React.useState<dateType>({ id: "", date: "", });
  const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" });
  const [IDCollector, setIDCollector] = React.useState<IDCollectorType>({ id: "", targetIDs: [] });
  const [masterFile, setMasterFile] = React.useState<masterfileType>({} as masterfileType)
  const [getComponents, setGetComponents] = React.useState<msgType>({ loaded: false, msg: "" });
  const [saved, setSaved] = React.useState<msgType>({ loaded: false, msg: "" });
  const [select, setSelect] = React.useState<string | null>(null);
  const [getlinks, setGetlinks] = React.useState<linkType[] | null>(null);
  //Getlinks (linkTypes)



  //CREATES INPUT,GTES ID AND CREATES S3kEY- MASTER AND RETURNS THE INPUT OBJECT AND NEW FILE
  async function newFileAndInputControlPoint(
    select: string,
    file: fileType
  ) {
    if (!select) return
    try {

      const encode = uuidv4().split("-")[0];
      const encode1 = uuidv4().split("-")[1];
      const s3KeyGen = `${encode}-${select}-${encode1}`;
      const genInput: inputType = {
        name: select,
        content: select,
        url: null,
        s3Key: s3KeyGen,
        type: select === "image" ? "image/png" : "text",
        fileId: file.id
      }
      const recFile = await addInput(genInput);
      if (!recFile) return file
      setSaved({ loaded: true, msg: "Newly selected added to file" })
      return recFile
    } catch (error) {
      let message: string = `${getErrorMessage(error)}@api/page-hit`
      alert(message)
      return
    }

  }
  ///GETTING LINKS

  return (
    <InputContext.Provider value={{ title, setTitle, subTitle, setSubTitle, file, setFile, filename, setFilename, heading, setHeading, summary, setSummary, subHeading, setSubHeading, section, setSection, date, setDate, msg, setMsg, IDCollector, setIDCollector, inputArr, masterFile, setMasterFile, getComponents, setGetComponents, saved, setSaved, input, setInput, allFiles, setAllFiles, userFiles, setUserFiles, select, setSelect, newFileAndInputControlPoint, getlinks, setGetlinks }}>
      {Props.children}
    </InputContext.Provider>
  )
}
