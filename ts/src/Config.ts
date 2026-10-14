
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'NagerDateSdk',
        slug: "nager-date-sdk",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "{base}",

    server: {
      "base": "",
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        country: {
        },
  
        country_v4_dto: {
        },
  
        iot_holiday: {
        },
  
        public_holiday_v4_dto: {
        },
  
        version: {
        },
  
    }
  }


  entity = {
    "country": {
      "fields": [
        {
          "name": "borders",
          "title": "Borders",
          "type": [
            "`$ONE`",
            [
              "`$NULL`",
              "`$ARRAY`"
            ]
          ],
          "short": "Neighboring countries based on geographical borders."
        },
        {
          "name": "commonName",
          "title": "Common Name",
          "type": "`$STRING`",
          "req": true,
          "short": "The commonly used name of the country."
        },
        {
          "name": "countryCode",
          "title": "Country Code",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO 3166-1 alpha-2 country code."
        },
        {
          "name": "id",
          "title": "Id",
          "type": "`$STRING`"
        },
        {
          "name": "nativeName",
          "title": "Native Name",
          "type": "`$STRING`",
          "req": true,
          "short": "The name of the country in its native language."
        },
        {
          "name": "officialName",
          "title": "Official Name",
          "type": "`$STRING`",
          "req": true,
          "short": "The official name of the country."
        },
        {
          "name": "region",
          "title": "Region",
          "type": "`$STRING`",
          "req": true,
          "short": "Geopolitical or continental region of the country."
        }
      ],
      "id": {
        "field": "id",
        "name": "id"
      },
      "name": "country",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/Countries/{countryCode}",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "Countries"
                },
                {
                  "var": "id"
                }
              ],
              "parts": [
                "api",
                "v4",
                "Countries",
                "{id}"
              ],
              "rename": {
                "param": {
                  "countryCode": "id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "id",
                    "orig": "countryCode",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true,
                    "example": "us"
                  }
                ]
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "country_v4_dto": {
      "fields": [
        {
          "name": "countryCode",
          "title": "Country Code",
          "type": "`$STRING`",
          "req": true,
          "short": "The ISO 3166-1 alpha-2 country code (e.g., \"US\", \"DE\")."
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "req": true,
          "short": "The common name of the country."
        }
      ],
      "name": "country_v4_dto",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/Countries/Available",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "Countries"
                },
                {
                  "lit": "Available"
                }
              ],
              "parts": [
                "api",
                "v4",
                "Countries",
                "Available"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "iot_holiday": {
      "fields": [],
      "name": "iot_holiday",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/IotHolidays/{isoCode}/IsToday/{offset}",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "IotHolidays"
                },
                {
                  "var": "iot_holiday_id"
                },
                {
                  "lit": "IsToday"
                },
                {
                  "var": "offset"
                }
              ],
              "parts": [
                "api",
                "v4",
                "IotHolidays",
                "{iot_holiday_id}",
                "IsToday",
                "{offset}"
              ],
              "rename": {
                "param": {
                  "isoCode": "iot_holiday_id"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "iot_holiday_id",
                    "orig": "isoCode",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true,
                    "example": "us"
                  },
                  {
                    "name": "offset",
                    "orig": "offset",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true,
                    "example": 0
                  }
                ]
              },
              "select": {
                "exist": [
                  "iot_holiday_id",
                  "offset"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "public_holiday_v4_dto": {
      "fields": [
        {
          "name": "countryCode",
          "title": "Country Code",
          "type": "`$STRING`",
          "req": true,
          "short": "ISO 3166-1 alpha-2 country code."
        },
        {
          "name": "date",
          "title": "Date",
          "type": "`$STRING`",
          "req": true,
          "short": "The date of the holiday.",
          "format": "date"
        },
        {
          "name": "holidayTypes",
          "title": "Holiday Types",
          "type": "`$ARRAY`",
          "req": true,
          "short": "List of holiday types this holiday is classified under."
        },
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "req": true,
          "short": "English name of the holiday."
        },
        {
          "name": "nationalHoliday",
          "title": "National Holiday",
          "type": "`$BOOLEAN`",
          "short": "Indicates if this holiday applies to the entire country."
        },
        {
          "name": "subdivisionCodes",
          "title": "Subdivision Codes",
          "type": [
            "`$ONE`",
            [
              "`$NULL`",
              "`$ARRAY`"
            ]
          ],
          "short": "ISO-3166-2 codes of the subdivisions where this holiday applies"
        }
      ],
      "name": "public_holiday_v4_dto",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/Holidays/{countryCode}/{year}",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "Holidays"
                },
                {
                  "var": "country_code"
                },
                {
                  "var": "year"
                }
              ],
              "parts": [
                "api",
                "v4",
                "Holidays",
                "{country_code}",
                "{year}"
              ],
              "rename": {
                "param": {
                  "countryCode": "country_code"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "country_code",
                    "orig": "countryCode",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true,
                    "example": "us"
                  },
                  {
                    "name": "year",
                    "orig": "year",
                    "type": "`$INTEGER`",
                    "kind": "param",
                    "reqd": true,
                    "example": 2026
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_code",
                  "year"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            },
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/Holidays/{countryCode}/Next",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "Holidays"
                },
                {
                  "var": "country_code"
                },
                {
                  "lit": "Next"
                }
              ],
              "parts": [
                "api",
                "v4",
                "Holidays",
                "{country_code}",
                "Next"
              ],
              "rename": {
                "param": {
                  "countryCode": "country_code"
                }
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {
                "params": [
                  {
                    "name": "country_code",
                    "orig": "countryCode",
                    "type": "`$STRING`",
                    "kind": "param",
                    "reqd": true,
                    "example": "us"
                  }
                ]
              },
              "select": {
                "exist": [
                  "country_code"
                ]
              },
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "version": {
      "fields": [
        {
          "name": "name",
          "title": "Name",
          "type": "`$STRING`",
          "req": true,
          "short": "The name of the library."
        },
        {
          "name": "version",
          "title": "Version",
          "type": "`$STRING`",
          "req": true,
          "short": "The version of the library."
        }
      ],
      "name": "version",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/v4/Versions",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "v4"
                },
                {
                  "lit": "Versions"
                }
              ],
              "parts": [
                "api",
                "v4",
                "Versions"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {},
              "response": {
                "kind": "json",
                "media": "application/json"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

