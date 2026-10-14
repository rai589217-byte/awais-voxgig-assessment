# Developer-experience report: Nager.Date SDK

## Selection and source

Nager.Date Community V4 was selected for its public OpenAPI document, useful holiday/country operations, and credential-free community endpoints. Sources: <https://date.nager.at/> and <https://date.nager.at/openapi/community-v4.json>.

On 14 October 2026, searching the Voxgig catalogue for `Nager` returned no match; a GitHub organisation search for `nager-date-sdk` also found no Voxgig catalogue repository. This records the check performed, not a permanent guarantee.

## Generator run

The initially tried deprecated Swagger URL returned Scalar HTML, not JSON. The documentation page identified the actual Community V4 document, which was downloaded before scaffold generation: `npx --yes @voxgig/create-sdkgen@0.30.7 nager-date-sdk -o . -d .\openapi.json`.

The scaffold hit the same Windows `spawn npm ENOENT` failure. After `npm.cmd install`, the installed generator added `ts` and `test`. `voxgig-sdkgen doctor` reported `.sdk matches the scaffold (0 additive)`. As separately reproduced in the Frankfurter project, model-relative template lookup required generating from `.sdk/model` plus a local `tm` junction; no generated output was edited.

## Results and observations

- Parsing: 5 entities, 6 paths, 6 methods.
- Generation: TypeScript completed. The parser warned that the upstream spec has no concrete server URL, producing required `server.base`; `BasicIotHolidayFlow` was also reported unreachable.
- Build: `npm run build` passed.
- Offline tests: 242 total; 229 passed, 0 failed, 13 skipped, 0 todo. Skips cover unselected optional features.
- Live calls, credentials, and live tests were not used.

The SDK provides useful typed entities and surfaces the missing base URL rather than guessing. A better generator default/override for known upstream bases would improve its quickstart. Windows should use `npm.cmd` and resolve template includes relative to the model. An optional naming policy could make schema names such as `CountryV4Dto` friendlier.
