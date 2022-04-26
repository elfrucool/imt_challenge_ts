import { BandWidthInKilobytesPerSecond } from "../types/types"

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