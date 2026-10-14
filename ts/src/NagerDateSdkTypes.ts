// Typed models for the NagerDateSdk SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Country {
  borders?: null | any[]
  commonName: string
  countryCode: string
  id?: string
  nativeName: string
  officialName: string
  region: string
}

export interface CountryLoadMatch {
  id: string
}

export interface CountryV4Dto {
  countryCode: string
  name: string
}

export interface CountryV4DtoListMatch {
  countryCode?: string
  name?: string
}

export interface IotHoliday {
}

export interface IotHolidayLoadMatch {
  iot_holiday_id: string
  offset: number
}

export interface PublicHolidayV4Dto {
  countryCode: string
  date: string
  holidayTypes: any[]
  name: string
  nationalHoliday?: boolean
  subdivisionCodes?: null | any[]
}

export interface PublicHolidayV4DtoListMatch {
  country_code: string
  year?: number
}

export interface Version {
  name: string
  version: string
}

export interface VersionLoadMatch {
  name?: string
  version?: string
}

