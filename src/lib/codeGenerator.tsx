import { v4 as uuidv4 } from "uuid";

export function gen_uuid() {
    return uuidv4().split("-")[0]
}
