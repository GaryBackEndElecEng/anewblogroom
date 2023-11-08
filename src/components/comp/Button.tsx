import React from "react";

interface Props {
    border?: boolean,
    color?: string,
    children?: React.ReactNode,
    height?: string,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    radius?: string,
    width?: string,
    tracking?: boolean,
    bg?: string,
    shadow?: boolean,
    shade?: string

}

const Button: React.FC<Props> = ({
    border,
    color,
    children,
    height,
    onClick,
    radius,
    width,
    tracking,
    bg,
    shadow,
    shade
}) => {

    const isColor: boolean = color ? true : false;
    const boxShadow = `1px 1px 7px 2px ${shade},-1px -1px 7px 2px ${color} `;
    return (
        <button
            onClick={onClick}
            style={{
                borderRadius: radius,
                height,
                width,
                color,
                background: bg,
                boxShadow: (shadow ? boxShadow : ""),

            }}
            className={`px-3 py-1 rounded-full text-center ${border ? "border" : ""} ${isColor ? (`border-emerald-800`) : ""} ${isColor ? (`shadow-md shadow-${color}-800`) : ""} ${isColor ? (`bg-emerald-600`) : ""} text-sm ${isColor ? (`hover:bg-blue-800`) : ""} text-white/70 hover:text-white ${tracking ? ("hover:tracking-wide") : ""} my-3`}
        >
            {children}
        </button>
    );
}

export default Button;