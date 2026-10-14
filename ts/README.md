# NagerDateSdk TypeScript SDK



The TypeScript SDK for the NagerDateSdk API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Country()` — each with a small set of operations (`list`, `load`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/nager-date-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/nager-date-sdk
npm install ./nager-date-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { NagerDateSdkSDK } from '@voxgig-sdk/nager-date-sdk'

const client = new NagerDateSdkSDK({
  // Required: this API's server URL is templated on these.
  server: {
    base: '<base>',
  },
})
```

### 3. Load a country

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const country = await client.Country().load({ id: 'example_id' })
  console.log(country.data())
} catch (err) {
  console.error('load failed:', err)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const countryv4dtos = await client.CountryV4Dto().list()
  console.log(countryv4dtos.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = NagerDateSdkSDK.test()

const countryv4dtos = await client.CountryV4Dto().list()
// countryv4dtos is an array of CountryV4Dto entities, one per mock record
console.log(countryv4dtos.map((countryv4dto) => countryv4dto.data()))
```

You can also use the instance method:

```ts
const client = new NagerDateSdkSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.CountryV4Dto()

// First call runs the operation and stores its result
await entity.list()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new NagerDateSdkSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
NAGER_DATE_SDK_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### NagerDateSdkSDK

#### Constructor

```ts
new NagerDateSdkSDK(options?: {
  server?: { base: string }
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `server` | `object` | **Required.** Values for the server-URL variables: `base`. The API base URL is a template over them. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Country(data?)` | `CountryEntity` | Create a Country entity instance. |
| `CountryV4Dto(data?)` | `CountryV4DtoEntity` | Create a CountryV4Dto entity instance. |
| `IotHoliday(data?)` | `IotHolidayEntity` | Create an IotHoliday entity instance. |
| `PublicHolidayV4Dto(data?)` | `PublicHolidayV4DtoEntity` | Create a PublicHolidayV4Dto entity instance. |
| `Version(data?)` | `VersionEntity` | Create a Version entity instance. |
| `tester(testopts?, sdkopts?)` | `NagerDateSdkSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `NagerDateSdkSDK.test(testopts?, sdkopts?)` | `NagerDateSdkSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): NagerDateSdkSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` resolves to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Country

| Field | Description |
| --- | --- |
| `borders` | Neighboring countries based on geographical borders. |
| `commonName` | The commonly used name of the country. |
| `countryCode` | ISO 3166-1 alpha-2 country code. |
| `id` |  |
| `nativeName` | The name of the country in its native language. |
| `officialName` | The official name of the country. |
| `region` | Geopolitical or continental region of the country. |

Operations: load.

API path: `/api/v4/Countries/{countryCode}`

#### CountryV4Dto

| Field | Description |
| --- | --- |
| `countryCode` | The ISO 3166-1 alpha-2 country code (e.g., "US", "DE"). |
| `name` | The common name of the country. |

Operations: list.

API path: `/api/v4/Countries/Available`

#### IotHoliday

| Field | Description |
| --- | --- |

Operations: load.

API path: `/api/v4/IotHolidays/{isoCode}/IsToday/{offset}`

#### PublicHolidayV4Dto

| Field | Description |
| --- | --- |
| `countryCode` | ISO 3166-1 alpha-2 country code. |
| `date` | The date of the holiday. |
| `holidayTypes` | List of holiday types this holiday is classified under. |
| `name` | English name of the holiday. |
| `nationalHoliday` | Indicates if this holiday applies to the entire country. |
| `subdivisionCodes` | ISO-3166-2 codes of the subdivisions where this holiday applies |

Operations: list.

API path: `/api/v4/Holidays/{countryCode}/{year}`

#### Version

| Field | Description |
| --- | --- |
| `name` | The name of the library. |
| `version` | The version of the library. |

Operations: load.

API path: `/api/v4/Versions`



## Entities


### Country

Create an instance: `const country = client.Country()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `borders` | `null | any[]` | Neighboring countries based on geographical borders. |
| `commonName` | `string` | The commonly used name of the country. |
| `countryCode` | `string` | ISO 3166-1 alpha-2 country code. |
| `id` | `string` |  |
| `nativeName` | `string` | The name of the country in its native language. |
| `officialName` | `string` | The official name of the country. |
| `region` | `string` | Geopolitical or continental region of the country. |

#### Example: Load

```ts
const country = await client.Country().load({ id: 'country_id' })
```


### CountryV4Dto

Create an instance: `const country_v4_dto = client.CountryV4Dto()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `countryCode` | `string` | The ISO 3166-1 alpha-2 country code (e.g., "US", "DE"). |
| `name` | `string` | The common name of the country. |

#### Example: List

```ts
const country_v4_dtos = await client.CountryV4Dto().list()
```


### IotHoliday

Create an instance: `const iot_holiday = client.IotHoliday()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```ts
const iot_holiday = await client.IotHoliday().load({ iot_holiday_id: 'iot_holiday_id', offset: 1 })
```


### PublicHolidayV4Dto

Create an instance: `const public_holiday_v4_dto = client.PublicHolidayV4Dto()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `countryCode` | `string` | ISO 3166-1 alpha-2 country code. |
| `date` | `string` | The date of the holiday. |
| `holidayTypes` | `any[]` | List of holiday types this holiday is classified under. |
| `name` | `string` | English name of the holiday. |
| `nationalHoliday` | `boolean` | Indicates if this holiday applies to the entire country. |
| `subdivisionCodes` | `null | any[]` | ISO-3166-2 codes of the subdivisions where this holiday applies |

#### Example: List

```ts
const public_holiday_v4_dtos = await client.PublicHolidayV4Dto().list({ country_code: "example" })
```


### Version

Create an instance: `const version = client.Version()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | The name of the library. |
| `version` | `string` | The version of the library. |

#### Example: Load

```ts
const version = await client.Version().load()
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
nager-date-sdk/
├── src/
│   ├── NagerDateSdkSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { NagerDateSdkSDK } from '@voxgig-sdk/nager-date-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const countryv4dto = client.CountryV4Dto()
await countryv4dto.list()

// countryv4dto.data() now returns the countryv4dto data from the last `list`
// countryv4dto.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
