import { CollectingSink, Reader } from "../types/types"

/**
 * Process all the information for the given reader, using a given sink.
 * (for our case, the hash algorithm with its buffer inside.)
 * 
 * ```javascript
 * // usage
 * const response: Response = await fetch('http://some-url')
 * const body: ReadableStream<Uint8Array> = response.body
 * const reader: Reader<Uint8Array> = body.getReader()
 * const sink: CollectingSink<Uint8Array, number[]> = mkSink()
 * const hash: number[] = await process(sink)(reader)
 * // do something with hash
 * ```
 * 
 * @param sink the receiver of the data
 * @returns a function that takes a reader and returns a promise of returning an array of numbers
 */
export function process(sink: CollectingSink<Uint8Array, number[]>): (x:Reader<Uint8Array>)
                                                                  => Promise<number[]> {
    return async function doProcess(reader: Reader<Uint8Array>): Promise<number[]> {
        const alwaysTrue = true

        do {
            const readResult = await reader.read()

            if (readResult.value !== undefined && readResult.value !== null) {
                sink.write(readResult.value)
            }

            if (readResult.done) {
                return sink.getCollectedResult()
            }

            // ideally I would use recursion
            // but on JS/TS, tail-call optimization is not supported
            // and we are assuming reduced resources environment
        } while(alwaysTrue)
    }
}