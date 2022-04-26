// -- TYPES/FUNCTIONS RELATED TO STREAM PROCESSING

/**
 * T - the type of writing
 * V - the collected result type
 */
export interface CollectingSink<T, V> {
    write(t:T): Promise<void>
    getCollectedResult(): V
}

/**
 * Simplified version of reader only focused on read()
 */
export interface Reader<T> {
    read: () => Promise<ReadableStreamDefaultReadResult<T>>
}

// TYPES/FUNCTIONS RELATED TO OPTIONS (specially for throttling)

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

// TYPES RELATED TO ERROR HANDLING

export interface EitherLeft<L> {
    readonly kind: "Left"
    readonly value: L
}

export interface EitherRight<R> {
    readonly kind: "Right"
    readonly value: R
}

export type Either<L, R> = EitherLeft<L> | EitherRight<R>

export function Left<L>(value: L): EitherLeft<L> {
    return {kind: 'Left', value}
}

export function Right<R>(value: R): EitherRight<R> {
    return {kind: 'Right', value}
}

export function eitherMatch<L, R, T>(onLeft: (l:L) => T, onRight: (r:R) => T, e: Either<L, R>): T {
    if (e.kind == 'Left') {
        return onLeft(e.value)
    }

    return onRight(e.value)
}