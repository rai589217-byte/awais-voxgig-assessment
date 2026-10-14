

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { NagerDateSdkSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('PublicHolidayV4DtoEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NagerDateSdkSDK.test()
    const ent = testsdk.PublicHolidayV4Dto()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NagerDateSdkSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.PublicHolidayV4Dto().list({"country_code":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NAGER_DATE_SDK_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'public_holiday_v4_dto.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"countryCode":{"a":true,"h":"Country Code","n":"countryCode","r":true,"sh":"ISO 3166-1 alpha-2 country code.","t":"`$STRING`","key$":"countryCode","index$":0},"date":{"a":true,"fo":"date","h":"Date","n":"date","r":true,"sh":"The date of the holiday.","t":"`$STRING`","key$":"date","index$":1},"holidayTypes":{"a":true,"h":"Holiday Types","n":"holidayTypes","r":true,"sh":"List of holiday types this holiday is classified under.","t":"`$ARRAY`","key$":"holidayTypes","index$":2},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"English name of the holiday.","t":"`$STRING`","key$":"name","index$":3},"nationalHoliday":{"a":true,"h":"National Holiday","n":"nationalHoliday","r":false,"sh":"Indicates if this holiday applies to the entire country.","t":"`$BOOLEAN`","key$":"nationalHoliday","index$":4},"subdivisionCodes":{"a":true,"h":"Subdivision Codes","n":"subdivisionCodes","r":false,"sh":"ISO-3166-2 codes of the subdivisions where this holiday applies","t":["`$ONE`",["`$NULL`","`$ARRAY`"]],"key$":"subdivisionCodes","index$":5}},"name":"public_holiday_v4_dto","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v4/Holidays/{countryCode}/{year}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"us","k":"param","n":"country_code","or":"countryCode","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":2026,"k":"param","n":"year","or":"year","r":true,"t":"`$INTEGER`","index$":1}]},"k":"http","m":"GET","o":"/api/v4/Holidays/{countryCode}/{year}","q":{"exist":["country_code","year"]},"r":{"param":{"countryCode":"country_code"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"Holidays"},{"var":"country_code"},{"var":"year"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /api/v4/Holidays/{countryCode}/Next","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"us","k":"param","n":"country_code","or":"countryCode","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/api/v4/Holidays/{countryCode}/Next","q":{"exist":["country_code"]},"r":{"param":{"countryCode":"country_code"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"Holidays"},{"var":"country_code"},{"lit":"Next"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"public_holiday_v4_dto","name__orig":"public_holiday_v4_dto","Name":"PublicHolidayV4Dto","name_":"public_holiday_v4_dto","name-":"public-holiday-v4-dto","NAME":"PUBLIC_HOLIDAY_V4_DTO","index$":3}, {"active":true,"entity":"public_holiday_v4_dto","key$":"BasicPublicHolidayV4DtoFlow","kind":"basic","name":"BasicPublicHolidayV4DtoFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{"country_code":"country_code01"},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"public_holiday_v4_dto_ref01"}}]}]}, 'PublicHolidayV4Dto', {"GET /api/v4/Holidays/{countryCode}/{year}":{"protocol":"http","parameters":[{"name":"countryCode","in":"path","description":"A valid `ISO 3166-1 alpha-2` country code.","required":true,"schema":{"type":"string","default":"us"},"index$":0},{"name":"year","in":"path","description":"The target year for which public holidays should be retrieved.","required":true,"schema":{"type":"integer","format":"int32","default":2026},"index$":1}]},"GET /api/v4/Holidays/{countryCode}/Next":{"protocol":"http","parameters":[{"name":"countryCode","in":"path","description":"A valid `ISO 3166-1 alpha-2` country code.","required":true,"schema":{"type":"string","default":"us"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let public_holiday_v4_dto_ref01_data = Object.values(setup.data.existing.public_holiday_v4_dto)[0] as any

    // LIST
    const public_holiday_v4_dto_ref01_ent = client.PublicHolidayV4Dto()
    const public_holiday_v4_dto_ref01_match: any = {}
    public_holiday_v4_dto_ref01_match['country_code'] = setup.idmap['country_code01']

    const public_holiday_v4_dto_ref01_list = (await public_holiday_v4_dto_ref01_ent.list(public_holiday_v4_dto_ref01_match)).map((e: any) => e.data())


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/public_holiday_v4_dto/PublicHolidayV4DtoTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = NagerDateSdkSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['public_holiday_v4_dto01','public_holiday_v4_dto02','public_holiday_v4_dto03','country_code01'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_PUBLIC_HOLIDAY_V4_DTO_ENTID': idmap,
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_TEST_EXPLAIN': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  idmap = env['NAGER_DATE_SDK_TEST_PUBLIC_HOLIDAY_V4_DTO_ENTID']

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NAGER_DATE_SDK_TEST_PUBLIC_HOLIDAY_V4_DTO_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new NagerDateSdkSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        server: {
          base: env.NAGER_DATE_SDK_SERVER_BASE,
        },
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.NAGER_DATE_SDK_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
