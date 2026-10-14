

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


describe('VersionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = NagerDateSdkSDK.test()
    const ent = testsdk.Version()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = NagerDateSdkSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Version().load({"name":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.NAGER_DATE_SDK_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'version.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"The name of the library.","t":"`$STRING`","key$":"name","index$":0},"version":{"a":true,"h":"Version","n":"version","r":true,"sh":"The version of the library.","t":"`$STRING`","key$":"version","index$":1}},"name":"version","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v4/Versions","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/v4/Versions","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v4"},{"lit":"Versions"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"version","name__orig":"version","Name":"Version","name_":"version","name-":"version","NAME":"VERSION","index$":4}, {"active":true,"entity":"version","key$":"BasicVersionFlow","kind":"basic","name":"BasicVersionFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"version_ref01","srcdatavar":"version_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-version_ref01"}}]}]}, 'Version', {"GET /api/v4/Versions":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let version_ref01_data = Object.values(setup.data.existing.version)[0] as any

    // LOAD
    const version_ref01_ent = client.Version()
    const version_ref01_match_dt0: any = {}
    const version_ref01_data_dt0 = (await version_ref01_ent.load(version_ref01_match_dt0)).data()
    assert(null != version_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/version/VersionTestData.json')

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
    ['version01','version02','version03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_VERSION_ENTID': idmap,
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_TEST_EXPLAIN': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  idmap = env['NAGER_DATE_SDK_TEST_VERSION_ENTID']

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['NAGER_DATE_SDK_TEST_VERSION_ENTID']
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
  
