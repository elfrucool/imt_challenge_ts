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
    return doProcess(0)

    function doProcess(previousTotalBytesRead: number): (reader: Reader<Uint8Array>) => Promise<number[]> {
        return async reader => {
            const readResult = await reader.read()

            if (readResult.done) {
                console.log(`[process] finished reading ${previousTotalBytesRead} bytes.`)
                return sink.getCollectedResult()
            }

            const newTotalBytes = previousTotalBytesRead + readResult.value.length

            console.log(`[process] reading ${readResult.value.length} bytes (total: ${newTotalBytes} bytes.)`)

            await sink.write(readResult.value)

            return await doProcess(newTotalBytes)(reader)
        }
    }
}