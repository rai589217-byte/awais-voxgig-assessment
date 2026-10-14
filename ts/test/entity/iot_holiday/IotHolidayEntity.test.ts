

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


describe('IotHolidayEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NagerDateSdkSDK.test()
    const ent = testsdk.IotHoliday()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NagerDateSdkSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.IotHoliday().load({"iot_holiday_id":1,"offset":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NAGER_DATE_SDK_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'iot_holiday.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{},"name":"iot_holiday","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v4/IotHolidays/{isoCode}/IsToday/{offset}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"us","k":"param","n":"iot_holiday_id","or":"isoCode","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":0,"k":"param","n":"offset","or":"offset","r":true,"t":"`$INTEGER`","index$":1}]},"k":"http","m":"GET","o":"/api/v4/IotHolidays/{isoCode}/IsToday/{offset}","q":{"exist":["iot_holiday_id","offset"]},"r":{"param":{"isoCode":"iot_holiday_id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"IotHolidays"},{"var":"iot_holiday_id"},{"lit":"IsToday"},{"var":"offset"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"iot_holiday","name__orig":"iot_holiday","Name":"IotHoliday","name_":"iot_holiday","name-":"iot-holiday","NAME":"IOT_HOLIDAY","index$":2}, {"active":true,"entity":"iot_holiday","key$":"BasicIotHolidayFlow","kind":"basic","name":"BasicIotHolidayFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"iot_holiday_ref01","srcdatavar":"iot_holiday_ref01_data","suffix":"_dt0"},"m":{"id":"iot_holiday01","iot_holiday_id":"iot_holiday01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-iot_holiday_ref01"}}],"unreachable":true}]}, 'IotHoliday', {"GET /api/v4/IotHolidays/{isoCode}/IsToday/{offset}":{"protocol":"http","parameters":[{"name":"isoCode","in":"path","description":"A valid ISO 3166-1 alpha-2 country code (e.g., \"AT\") or an ISO 3166-2 subdivision code (e.g., \"AT-1\").","required":true,"schema":{"minLength":2,"type":"string","default":"us"},"index$":0},{"name":"offset","in":"path","description":"UTC timezone offset in hours (range: -12 to +12). Default is 0.","required":true,"schema":{"maximum":12,"minimum":-12,"type":"integer","format":"int32","default":0},"index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let iot_holiday_ref01_data = Object.values(setup.data.existing.iot_holiday)[0] as any

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
      '../../../../.sdk/test/entity/iot_holiday/IotHolidayTestData.json')

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
    ['iot_holiday01','iot_holiday02','iot_holiday03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_IOT_HOLIDAY_ENTID': idmap,
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_TEST_EXPLAIN': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  idmap = env['NAGER_DATE_SDK_TEST_IOT_HOLIDAY_ENTID']

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NAGER_DATE_SDK_TEST_IOT_HOLIDAY_ENTID']
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
  
