import { BandWidthInKilobytesPerSecond, Either, Left, mkBandWidthInKilobytesPerSecond, Right } from "../types/types"

export interface CliOptionsBase {
    readonly url: string
    readonly filename: string
}

export interface CliOptionsWithoutThrottling extends CliOptionsBase {
    readonly kind: 'WithoutThrottling'
}
export const mkCliOptionsWithoutThrottling: (url: string, filename: string) => CliOptionsWithoutThrottling
    = (url, filename) => ({ kind: 'WithoutThrottling', url, filename })

export interface CliOptionsWithThrottling extends CliOptionsBase {
    readonly kind: 'WithThrottling'
    bandWidth: BandWidthInKilobytesPerSecond
}
export const mkCliOptionsWithThrottling: ( url: string
                                         , filename: string
                                         , bandWidth: BandWidthInKilobytesPerSecond
                                         )
                                      => CliOptionsWithThrottling
    = (url, filename, bandWidth) => ({kind: 'WithThrottling', url, filename, bandWidth})

export type CliOptions = CliOptionsWithoutThrottling | CliOptionsWithThrottling

export function cliOptionsMatch<T>( onWithoutThrottling: (withoutThrottling: CliOptionsWithoutThrottling) => T,
                                    onWithThrottling: (withThrottling: CliOptionsWithThrottling) => T,
                                    cliOptions: CliOptions): T
{
    if (cliOptions.kind == 'WithoutThrottling') {
        return onWithoutThrottling(cliOptions)
    }

    return onWithThrottling(cliOptions)
}

// -- CLI PARSING ERRORS

export interface CliErrorNotEnoughArguments {
    kind: 'NotEnoughArguments'
}

export const NotEnoughArguments: CliErrorNotEnoughArguments = { kind: 'NotEnoughArguments' }

export interface CliErrorInvalidThrottlingBandwidth {
    kind: 'InvalidThrottlingBandwidth'
    bandWidth: string
    errorDescription: string
}

export const InvalidThrottlingBandwidth: ( bandWidth: string, errorDescription: string )
                                        => CliErrorInvalidThrottlingBandwidth
    = (bandWidth, errorDescription) => ({ kind: 'InvalidThrottlingBandwidth', bandWidth, errorDescription })

export type CliError = CliErrorNotEnoughArguments | CliErrorInvalidThrottlingBandwidth

export const matchCliError: <T>( onNotEnoughArguments: () => T
                               , onInvalidThrottlingBandWidth: ( bandWidth: string, errorDescription: string)
                                                            => T
                               , cliError: CliError
                               ) => T
    = (onNotEnoughArguments, onInvalidThrottlingBandWidth, cliError) => (
        cliError.kind == 'NotEnoughArguments'
            ? onNotEnoughArguments()
            : onInvalidThrottlingBandWidth(cliError.bandWidth, cliError.errorDescription)
    )

export const parseCliOptions: (args: string[]) => Either<CliError, CliOptions>
    = args => {
        if (args.length < 2) {
            return Left(NotEnoughArguments)
        }

        const url:string = args[0]
        const filename:string = args[1]

        if (args.length === 2) {
            return Right(
                mkCliOptionsWithoutThrottling(url, filename)
            )
        }

        const parsedNumber: number = Number.parseInt(args[2], 10)

        if (isNaN(parsedNumber)) {
            return Left(InvalidThrottlingBandwidth(args[2], 'throttling bandwidth should be a number'))
        }

        if (parsedNumber < 1) {
            return Left(InvalidThrottlingBandwidth(args[2], 'throttling bandwidth must be positive integer'))
        }

        return Right(
            mkCliOptionsWithThrottling(
                url,
                filename,
                mkBandWidthInKilobytesPerSecond( parsedNumber )
            )
        )
    }