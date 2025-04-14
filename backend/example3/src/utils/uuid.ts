import { v4 as uuidv4 } from "uuid"
export function generateUUID(): string {
    const id = uuidv4()
    return id
}
