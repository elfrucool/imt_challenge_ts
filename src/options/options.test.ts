import { Either, Left, mkBandWidthInKilobytesPerSecond, Right } from "../types/types"
import { CliError, CliOptions, InvalidThrottlingBandwidth, mkCliOptionsWithoutThrottling, mkCliOptionsWithThrottling, NotEnoughArguments, parseCliOptions } from "./options"

describe('parsing options scenarios', () => {
    it.each([0, 1])('should fail when not enough arguments', n => {
        const args = Array(n).fill('foo')
        const result: Either<CliError, CliOptions> = parseCliOptions(args)
        expect(result).toEqual(
            Left( NotEnoughArguments)
        )
    })

    it('should fail when bandwidth is not numeric', () => {
        const args = ['url', 'file', 'not-a-number']
        const result: Either<CliError, CliOptions> = parseCliOptions(args)
        expect(result).toEqual(
            Left(
                InvalidThrottlingBandwidth( 'not-a-number', 'throttling bandwidth should be a number' )
            )
        )
    })

    it.each([-1, 0])('should fail when bandwidth is not a positive number', n => {
        const args = ['url', 'file', `${n}`]
        const result: Either<CliError, CliOptions> = parseCliOptions(args)
        expect(result).toEqual(
            Left(
                InvalidThrottlingBandwidth( `${n}`, 'throttling bandwidth must be positive integer')
            )
        )
    })

    it('bandwidth must be optional', () => {
        const args = ['url', 'file']
        const result: Either<CliError, CliOptions> = parseCliOptions(args)
        expect(result).toEqual(
            Right(
                mkCliOptionsWithoutThrottling('url', 'file')
            )
        )
    })

    it('must include bandwidth if provided', () => {
        const args = ['url', 'file', '10']
        const result: Either<CliError, CliOptions> = parseCliOptions(args)
        expect(result).toEqual(
            Right(
                mkCliOptionsWithThrottling(
                    'url', 'file', mkBandWidthInKilobytesPerSecond(10)
                )
            )
        )
    })
})