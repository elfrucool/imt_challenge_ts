const coefficients:number[] = [2, 3, 5, 7, 11, 13, 17, 19]

// we want to minimize memory usage
// so this function modifies original buffer
export function hash(buffer:number[], b:number):number[] {
    for (let i = 0; i < buffer.length; i++) {
        const prevVal = i === 0 ? 0 : buffer[i - 1]
        buffer[i] = (prevVal + b) * coefficients[i] % 255
    }
    return buffer
}