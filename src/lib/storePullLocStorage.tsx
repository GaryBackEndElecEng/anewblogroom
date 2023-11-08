"use client"
import { fileType } from "./Types";



export function saveToStorage(file: fileType | undefined) {
    if (file) {
        const convertToStr = JSON.stringify(file);
        localStorage.setItem("file", convertToStr);
        return "saved"
    } else {
        return undefined
    }
}

export function getFromStorage() {
    const getFile: string | null = localStorage.getItem("file");
    if (getFile) {
        const file: fileType = JSON.parse(getFile);
        return file
    } else {
        return undefined
    }
}