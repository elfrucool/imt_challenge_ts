import { randomBytes, randomInt } from 'crypto'
import { hash } from './hash'

// we are working with previous hash values filled by random numbers
// also for 'should return input buffer' we are testing against random input bytes
describe('hash function properties', () => {
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    it.each(Array(100).fill(undefined))('should return input buffer', (_) => {
        const buffer:number[] = [...randomBytes(8)]
        const byte:number = randomInt(256)
        const returnedBuffer:number[] = hash(buffer, byte)
        expect(returnedBuffer).toEqual(buffer)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    it.each(Array(100).fill(undefined))('should return zeroes if byte is zero', (_) => {
        const buffer:number[] = [...randomBytes(8)]
        const byte = 0
        const returnedBuffer:number[] = hash(buffer, byte)
        expect(returnedBuffer).toBe(buffer)
        expect(returnedBuffer).toEqual(Array(8).fill(0))
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    it.each(Array(100).fill(undefined))('should calculate base example', (_) => {
        const buffer:number[] = [...randomBytes(8)]
        const byte = 12
        const returnedBuffer:number[] = hash(buffer, byte)
        expect(returnedBuffer).toEqual([24, 108, 90, 204, 81, 189, 102, 126])
    })
})