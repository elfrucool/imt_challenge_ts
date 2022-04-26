import { CollectingSink } from "../types/types"

const COEFFICIENTS:number[] = [2, 3, 5, 7, 11, 13, 17, 19]

// we want to minimize memory usage
// so this function modifies original buffer
export function hash(buffer:number[], b:number):number[] {
    for (let i = 0; i < buffer.length; i++) {
        const prevVal = i === 0 ? 0 : buffer[i - 1]
        buffer[i] = (prevVal + b) * COEFFICIENTS[i] % 255
    }
    return buffer
}

export function mkCollectingSink(): CollectingSink<Uint8Array, number[]> {
    const buffer:number[] = Array(8).fill(0)
    return {
        write: (chunk: Uint8Array) => chunk.forEach(n => hash(buffer, n)),
        getCollectedResult: () => buffer
    }
}