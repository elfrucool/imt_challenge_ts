import { BandWidthInBytesPerSecond, CollectingSink } from "../types/types";

export const mkThrottlingSink: (bandWidth: BandWidthInBytesPerSecond)
                            => (innerSink: CollectingSink<Uint8Array, number[]>)
                            => CollectingSink<Uint8Array, number[]>
    = bandWidth => innerSink => {
        const bytesPerSecond = bandWidth.bytesPerSecond
        // implementation does not do any sort of concurrency
        // when reading the response body
        // so it's safe to have a mutable variable here
        let bytesRead = 0
        return {
            write: async (chunk:Uint8Array) => {
                if (bytesRead < bytesPerSecond) {
                    bytesRead += chunk.length
                    return innerSink.write(chunk)
                }

                const timeOutInMillis = bytesRead * 1000 / bytesPerSecond

                bytesRead = 0

                setTimeout(() => innerSink.write(chunk), timeOutInMillis)

                return undefined
            },
            getCollectedResult: innerSink.getCollectedResult
        }
    }