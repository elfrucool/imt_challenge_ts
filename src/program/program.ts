import { writeFile } from "fs"
import { formatCliError, usage } from "../options/output"
import { mkCollectingSink } from "../hashing/hash"
import { CliError, CliOptions, cliOptionsMatch, parseCliOptions } from "../options/options"
import * as myProcess from "../process/process"
import { mkThrottlingSink } from "../support/throttling"
import { CollectingSink, Either, eitherMatch, Reader, toBytesPerSecond } from "../types/types"
import { getReader, fetch } from "../net/net"

export function program(): void {
    const args:string[] = process.argv.slice(2)
    const cliOptionsResult: Either<CliError, CliOptions> = parseCliOptions(args)
    eitherMatch(
        (error:CliError) => {
            console.error(`Invalid arguments: `, formatCliError(error))
            console.info(usage())
        },
        (cliOptions:CliOptions) =>
            fetchAndRun(cliOptions)
                .catch(reason => console.error(`got error`, reason)),
        cliOptionsResult
    )
}

async function fetchAndRun(options: CliOptions): Promise<void> {
    console.info(`running program with options:`, options)
    const response: NodeJS.ReadableStream = await fetch(options.url)
    const reader: Reader<Uint8Array> = getReader(response)
    const sink: CollectingSink<Uint8Array, number[]> = makeSink(options)
    const hash = await myProcess.process(sink)(reader)
    const hashAsHex = Buffer.from(hash).toString('hex')
    console.log("hash:", hashAsHex)
    writeHashIntoFile(options, hashAsHex)
}

function makeSink(options: CliOptions): CollectingSink<Uint8Array, number[]> {
    const hashSink: CollectingSink<Uint8Array, number[]> = mkCollectingSink()

    return cliOptionsMatch(
        () => hashSink,
        withThrottling => mkThrottlingSink(toBytesPerSecond(withThrottling.bandWidth))(hashSink),
        options
    )
}
function writeHashIntoFile(options: CliOptions, hashAsHex: string) {
    writeFile(options.filename, hashAsHex, handleError )
}

function handleError(err: NodeJS.ErrnoException | null) {
    if (err === null || err === undefined) {
        console.info("File saved.")
    } else {
        console.error("Error when writing file: ", err)
    }
}
