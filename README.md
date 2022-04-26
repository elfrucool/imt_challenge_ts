# CODE CHALLENGE: Computing hash Function (Node + Typescript version)

## The Use Case

> Build a program hat takes the given three arguments:
> 
> 1. a URL
> 2. a file name
> 3. a bandwidth for throttling (optional)
>
> And fetches the file given the URL,
> then computes its hash using the IMT hash function
> and stores the value in file under file name
> encoded as hex string.
>
> The IMT hash function is as follows:
>
> Length: 8 bytes
>
> ```typescript
> const coefficients:number[] = [2, 3, 5, 7, 11, 13, 17, 19 ]
> for each incoming byte, ib:
>     for each byte of the hash, h
>         h[i] = ((h[i-1] + ib) * coefficient[i]) % 255
>         // in the case where i-1 == -1, h[i-1] should be 0.
> ```
> 
> For example, hashing the data:
>
> `const data:number[] = [12]`
>
> Should result in a hash of:
>
> `[24, 108, 90, 204, 81, 189, 102, 126]`
>
> Then, when converted to hexadecimal for writing to the output file, it should be:
> `186c5acc51bd667e`
>
> Do not put the file in memory or disk, assume it may be bigger than available resources.

## Requirements

- Node v14.x:

  If you are using [`nvm`](https://github.com/nvm-sh/nvm); you can enable it by issuing `nvm use` (see [`.nvmrc`](./.nvmrc) file)

## How to test

```sh
$ npm test
```

## How to run the application

```sh
$ npm install
$ npm start -- <url> <file> [bandwidth]
```

## Known Issues

- [issue 1 - Throttling mechanism is not yet working properly](https://github.com/elfrucool/imt_challenge_ts/issues/1)
