

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


describe('CountryV4DtoEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NagerDateSdkSDK.test()
    const ent = testsdk.CountryV4Dto()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('country_v4_dto hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of NagerDateSdkSDK.test(offline).CountryV4Dto().stream('list')) { }
    }, /offline/)

    for await (const _item of NagerDateSdkSDK.test(offline).CountryV4Dto()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = NagerDateSdkSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.CountryV4Dto().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of NagerDateSdkSDK.test().CountryV4Dto().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new NagerDateSdkSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.CountryV4Dto().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.CountryV4Dto().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NagerDateSdkSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.CountryV4Dto().list({"countryCode":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NAGER_DATE_SDK_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'country_v4_dto.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"countryCode":{"a":true,"h":"Country Code","n":"countryCode","r":true,"sh":"The ISO 3166-1 alpha-2 country code (e.g., \"US\", \"DE\").","t":"`$STRING`","key$":"countryCode","index$":0},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"The common name of the country.","t":"`$STRING`","key$":"name","index$":1}},"name":"country_v4_dto","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v4/Countries/Available","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/v4/Countries/Available","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"Countries"},{"lit":"Available"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"country_v4_dto","name__orig":"country_v4_dto","Name":"CountryV4Dto","name_":"country_v4_dto","name-":"country-v4-dto","NAME":"COUNTRY_V4_DTO","index$":1}, {"active":true,"entity":"country_v4_dto","key$":"BasicCountryV4DtoFlow","kind":"basic","name":"BasicCountryV4DtoFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"country_v4_dto_ref01"}}]}]}, 'CountryV4Dto', {"GET /api/v4/Countries/Available":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let country_v4_dto_ref01_data = Object.values(setup.data.existing.country_v4_dto)[0] as any

    // LIST
    const country_v4_dto_ref01_ent = client.CountryV4Dto()
    const country_v4_dto_ref01_match: any = {}

    const country_v4_dto_ref01_list = (await country_v4_dto_ref01_ent.list(country_v4_dto_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/country_v4_dto/CountryV4DtoTestData.json')

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
    ['country_v4_dto01','country_v4_dto02','country_v4_dto03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_COUNTRY_V4_DTO_ENTID': idmap,
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_TEST_EXPLAIN': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  idmap = env['NAGER_DATE_SDK_TEST_COUNTRY_V4_DTO_ENTID']

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NAGER_DATE_SDK_TEST_COUNTRY_V4_DTO_ENTID']
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
  
