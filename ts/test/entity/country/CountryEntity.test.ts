

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


describe('CountryEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NagerDateSdkSDK.test()
    const ent = testsdk.Country()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NagerDateSdkSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Country().load({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NAGER_DATE_SDK_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'country.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"borders":{"a":true,"h":"Borders","n":"borders","r":false,"sh":"Neighboring countries based on geographical borders.","t":["`$ONE`",["`$NULL`","`$ARRAY`"]],"key$":"borders","index$":0},"commonName":{"a":true,"h":"Common Name","n":"commonName","r":true,"sh":"The commonly used name of the country.","t":"`$STRING`","key$":"commonName","index$":1},"countryCode":{"a":true,"h":"Country Code","n":"countryCode","r":true,"sh":"ISO 3166-1 alpha-2 country code.","t":"`$STRING`","key$":"countryCode","index$":2},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":3},"nativeName":{"a":true,"h":"Native Name","n":"nativeName","r":true,"sh":"The name of the country in its native language.","t":"`$STRING`","key$":"nativeName","index$":4},"officialName":{"a":true,"h":"Official Name","n":"officialName","r":true,"sh":"The official name of the country.","t":"`$STRING`","key$":"officialName","index$":5},"region":{"a":true,"h":"Region","n":"region","r":true,"sh":"Geopolitical or continental region of the country.","t":"`$STRING`","key$":"region","index$":6}},"id":{"field":"id","name":"id"},"name":"country","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v4/Countries/{countryCode}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"us","k":"param","n":"id","or":"countryCode","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/api/v4/Countries/{countryCode}","q":{"exist":["id"]},"r":{"param":{"countryCode":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"Countries"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"country","name__orig":"country","Name":"Country","name_":"country","name-":"country","NAME":"COUNTRY","index$":0}, {"active":true,"entity":"country","key$":"BasicCountryFlow","kind":"basic","name":"BasicCountryFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"country_ref01","srcdatavar":"country_ref01_data","suffix":"_dt0"},"m":{"id":"country01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-country_ref01"}}]}]}, 'Country', {"GET /api/v4/Countries/{countryCode}":{"protocol":"http","parameters":[{"name":"countryCode","in":"path","description":"The 2-letter ISO 3166-1 country code (e.g., \"US\", \"GB\").","required":true,"schema":{"type":"string","default":"us"},"index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let country_ref01_data = Object.values(setup.data.existing.country)[0] as any

    // LOAD
    const country_ref01_ent = client.Country()
    const country_ref01_match_dt0: any = {}
    country_ref01_match_dt0.id = country_ref01_data.id
    const country_ref01_data_dt0 = (await country_ref01_ent.load(country_ref01_match_dt0)).data()
    assert(country_ref01_data_dt0.id === country_ref01_data.id)


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
      '../../../../.sdk/test/entity/country/CountryTestData.json')

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
    ['country01','country02','country03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_COUNTRY_ENTID': idmap,
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_TEST_EXPLAIN': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  idmap = env['NAGER_DATE_SDK_TEST_COUNTRY_ENTID']

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NAGER_DATE_SDK_TEST_COUNTRY_ENTID']
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
  
