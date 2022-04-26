/**
 * T - the type of writing
 * V - the collected result type
 */
export interface CollectingSink<T, V> {
    write(t:T): void | Promise<void>
    getCollectedResult(): V
}

export interface Reader<T> {
    read: () => Promise<ReadableStreamDefaultReadResult<T>>
}