import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "country",
    "accessor": "Country",
    "op": "load",
    "method": "GET",
    "path": "/api/v4/Countries/{countryCode}",
    "args": [
      {
        "name": "id",
        "wire": "countryCode",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "commonName": "x",
      "nativeName": "x",
      "officialName": "x",
      "countryCode": "x",
      "region": "x",
      "borders": [
        {
          "commonName": "x",
          "nativeName": "x",
          "officialName": "x",
          "countryCode": "x",
          "region": "x"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "country_v4_dto",
    "accessor": "CountryV4Dto",
    "op": "list",
    "method": "GET",
    "path": "/api/v4/Countries/Available",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "countryCode": "x",
        "name": "x"
      }
    ],
    "idField": "id"
  },
  {
    "entity": "iot_holiday",
    "accessor": "IotHoliday",
    "op": "load",
    "method": "GET",
    "path": "/api/v4/IotHolidays/{isoCode}/IsToday/{offset}",
    "args": [
      {
        "name": "iot_holiday_id",
        "wire": "isoCode",
        "value": "p1"
      },
      {
        "name": "offset",
        "wire": "offset",
        "value": "p2"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": null,
    "idField": "id"
  },
  {
    "entity": "public_holiday_v4_dto",
    "accessor": "PublicHolidayV4Dto",
    "op": "list",
    "method": "GET",
    "path": "/api/v4/Holidays/{countryCode}/{year}",
    "args": [
      {
        "name": "country_code",
        "wire": "countryCode",
        "value": "p1"
      },
      {
        "name": "year",
        "wire": "year",
        "value": "p2"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "date": "2026-01-01",
        "name": "x",
        "countryCode": "x",
        "nationalHoliday": true,
        "subdivisionCodes": [
          "x"
        ],
        "holidayTypes": [
          "Public"
        ]
      }
    ],
    "idField": "id"
  },
  {
    "entity": "public_holiday_v4_dto",
    "accessor": "PublicHolidayV4Dto",
    "op": "list",
    "method": "GET",
    "path": "/api/v4/Holidays/{countryCode}/Next",
    "args": [
      {
        "name": "country_code",
        "wire": "countryCode",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "date": "2026-01-01",
        "name": "x",
        "countryCode": "x",
        "nationalHoliday": true,
        "subdivisionCodes": [
          "x"
        ],
        "holidayTypes": [
          "Public"
        ]
      }
    ],
    "idField": "id"
  },
  {
    "entity": "version",
    "accessor": "Version",
    "op": "load",
    "method": "GET",
    "path": "/api/v4/Versions",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "name": "x",
      "version": "x"
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
