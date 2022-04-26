import { Reader } from "../types/types";
import { ClientRequest, get, IncomingMessage } from 'http'

export function getReader(body: NodeJS.ReadableStream | null): Reader<Uint8Array> {
    return body != null
        ? readableStreamToReader(body)
        : {read: async () => ({done: true})}
}

function readableStreamToReader(rs: NodeJS.ReadableStream): Reader<Uint8Array> {
    return {
        read: async () => {
            const result = rs.read(1024)

            if (result == null) {
                return { done: true }
            }

            const buffer: Buffer = result instanceof Buffer
                ? result
                : Buffer.from(result)

            return buffer.length > 0
                ? { done: false, value: buffer.valueOf() }
                : { done: true }
        }
    }
}

export async function fetch(url: string): Promise<NodeJS.ReadableStream> {
    const getCurried: (u:string) => (cb: (im: IncomingMessage) => void) => ClientRequest
        = u => cb => get(u, cb)
    const responseHandler = getCurried(url)
    return new Promise(responseHandler)
}