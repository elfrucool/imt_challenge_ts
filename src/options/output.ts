import { CliError, matchCliError } from "./options";

export function formatCliError(cliError: CliError): string {
    return matchCliError(
        () => "Expected at least 2 arguments",
        (bandWidth, errorDescription) =>
            `Invalid throttling bandwidth (${bandWidth}), cause: ${errorDescription}`,
        cliError
    )
}

export function usage(): string {
    return (
`USAGE:
    index.js url filename [throttling-bandwidth]
ARGUMENTS:
    url
        the url to fetch the file
    filename
        the file name to store the hash
    throttling-bandwidth
        A number that express maximum speed in kb/s
`
    )
}