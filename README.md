# Nager.Date SDK assessment

An unofficial TypeScript SDK generated with Voxgig SDK Generator for the Nager.Date Community V4 public-holidays API. It exposes country lookup, available countries, public-holiday lists, version, and IoT holiday operations.

- Official API: <https://date.nager.at/>
- Official OpenAPI document: <https://date.nager.at/openapi/community-v4.json>
- Generator: <https://github.com/voxgig/sdkgen>
- Generated package: [`ts/`](ts/)

## Generation and local use

The checked-in model and source were produced from `openapi.json` using `@voxgig/create-sdkgen` 0.30.7 and `@voxgig/sdkgen` 4.34.5, with the `ts` target and `test` feature. Edit `.sdk/model/`, not generated `ts/` files. Node.js 24 or later is required.

```powershell
cd ts
npm install
npm run build
npm test
```

## Usage

The Community API is public and the generated model declares no authentication. The upstream document omits a concrete server URL, so the generated SDK requires `server.base`. This example uses the actual generated API in test mode and makes no live call.

```ts
import { NagerDateSdkSDK } from './ts/dist/NagerDateSdkSDK.js'

const client = NagerDateSdkSDK.test({}, {
  server: { base: 'https://date.nager.at' },
})
const countries = await client.CountryV4Dto().list()
console.log(countries.map((country) => country.data()))
```

For live requests, use `new NagerDateSdkSDK({ server: { base: 'https://date.nager.at' } })`. See [`ts/README.md`](ts/README.md) and [`ts/REFERENCE.md`](ts/REFERENCE.md). No live API calls were made.

## Limitations

The upstream spec omits the concrete base URL. Schema-derived names such as `CountryV4Dto` and `PublicHolidayV4Dto` are preserved. Only TypeScript and offline tests were generated. See [DX_REPORT.md](DX_REPORT.md).

## License

MIT. The downloaded upstream OpenAPI document does not assert a license; consult Nager.Date's terms before redistribution or production use.
