/**
 * T - the type of writing
 * V - the collected result type
 */
export interface CollectingSink<T, V> {
    write(t:T): void | Promise<void>
    getCollectedResult(): V
}

/**
 * Simplified version of reader only focused on read()
 */
export interface Reader<T> {
    read: () => Promise<ReadableStreamDefaultReadResult<T>>
}

export type BandWidthInBytesPerSecond = { bytesPerSecond: number }
export const mkBandWidthInBytesPerSecond: (bytesPerSecond:number) => BandWidthInBytesPerSecond
    = bytesPerSecond => ({ bytesPerSecond })

export type BandWidthInKilobytesPerSecond = { kilobytesPerSecond: number }
export const mkBandWidthInKilobytesPerSecond: (kilobytesPerSecond: number)
                                           => BandWidthInKilobytesPerSecond
    = kilobytesPerSecond => ({ kilobytesPerSecond })

export const toBytesPerSecond: (kilobytesPerSecond: BandWidthInKilobytesPerSecond)
                            => BandWidthInBytesPerSecond
    = ({kilobytesPerSecond}) => mkBandWidthInBytesPerSecond(kilobytesPerSecond * 1024)