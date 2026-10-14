# Community - API V4

> The Nager.Date Community API is a public service that provides reliable information about public holidays for countries around the world. It allows developers to query national holiday dates, check whether a specific day is a public holiday and list upcoming holidays.
>
> By using the API, you agree to the &lt;a href=&quot;https://date.nager.at/Legal/TermsOfService&quot;&gt;Terms of Service.&lt;/a&gt;

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 5 entities and 6 HTTP routes. There are 1 SDK targets.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Country

Results: Returns the requested country information.

SDK operations: `load`.

Key fields to recognise:

- `borders`: Neighboring countries based on geographical borders.
- `commonName`: The commonly used name of the country.
- `countryCode`: ISO 3166-1 alpha-2 country code.
- `nativeName`: The name of the country in its native language.
- `officialName`: The official name of the country.

### CountryV4Dto

Results: Successfully returns the list of supported countries.

SDK operations: `list`.

Key fields to recognise:

- `countryCode`: The ISO 3166-1 alpha-2 country code (for example, &quot;US&quot;, &quot;DE&quot;).
- `name`: The common name of the country.

### IotHoliday

Results: Today is a public holiday; Today is not a public holiday.

SDK operations: `load`.

### PublicHolidayV4Dto

Results: Successfully retrieved the list of public holidays.; A list of upcoming public holidays for the next 365 days.; No upcoming holidays were found for the specified country.

SDK operations: `list`.

Key fields to recognise:

- `countryCode`: ISO 3166-1 alpha-2 country code.
- `date`: The date of the holiday.
- `holidayTypes`: List of holiday types this holiday is classified under.
- `name`: English name of the holiday.
- `nationalHoliday`: Indicates if this holiday applies to the entire country.

### Version

Results: Successfully retrieved version information.

SDK operations: `load`.

Key fields to recognise:

- `name`: The name of the library.
- `version`: The version of the library.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Country | `load` | `GET /api/v4/Countries/{countryCode}` | See reference |
| CountryV4Dto | `list` | `GET /api/v4/Countries/Available` | See reference |
| IotHoliday | `load` | `GET /api/v4/IotHolidays/{isoCode}/IsToday/{offset}` | See reference |
| PublicHolidayV4Dto | `list` | `GET /api/v4/Holidays/{countryCode}/{year}` | See reference |
| PublicHolidayV4Dto | `list` | `GET /api/v4/Holidays/{countryCode}/Next` | See reference |
| Version | `load` | `GET /api/v4/Versions` | See reference |

## Connect to the API

- API server: `{base}`

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `test`: In-memory mock transport for testing without a live server

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

