import { randomBytes } from "crypto"
import { mkCollectingSink } from "../hashing/hash"
import { Reader } from "../types/types"
import { process } from "./process"

describe('process should iterate over all provided material', () => {
    it('on empty reader should return 0s', async () => {
        const emptyReader: Reader<Uint8Array> = {
            read: () => Promise.resolve({done: true, value: undefined})
        }

        const result:number[] = await (process(mkCollectingSink())(emptyReader))

        expect(result).toEqual(Array(8).fill(0))
    })

    it('non empty reader should iterate', async () => {
        let done = false
        const singleChunkReader: Reader<Uint8Array> = {
            read: async () => {
                if (done) {
                    return {done: true, value: undefined}
                }

                done = true

                return {done: false, value: Uint8Array.from([0, 1, 12])}
            }
        }

        const result:number[] = await process(mkCollectingSink())(singleChunkReader)

        expect(result).toEqual([24, 108, 90, 204, 81, 189, 102, 126])
    })

    it('should iterate all times until done', async () => {
        let remainingCalls = 3
        const remaningReader: Reader<Uint8Array> = {
            read: async () => {
                if (remainingCalls <= 0) {
                    return {done: true, value: undefined}
                }

                remainingCalls--;

                if (remainingCalls > 1) {
                    return {done: false, value: randomBytes(9)}
                }

                return {done: false, value: Uint8Array.from([0])}
            }
        }

        const result:number[] = await process(mkCollectingSink())(remaningReader)

        expect(result).toEqual(Array(8).fill(0))
    })
})