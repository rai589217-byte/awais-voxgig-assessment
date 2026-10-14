

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'


import { NagerDateSdkSDK } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  maybeSkipControl,
  skipIfMissingIds,
  liveMiss,
  liveEmpty,
  describeLive,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('PublicHolidayV4DtoDirect', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when NAGER_DATE_SDK_TEST_LIVE=TRUE.
  afterEach(liveDelay('NAGER_DATE_SDK_TEST_LIVE'))

  test('direct-exists', async () => {
    const sdk = new NagerDateSdkSDK({
      base: 'http://localhost:8080',
      system: { fetch: async () => ({}) }
    })
    assert('function' === typeof sdk.direct)
    assert('function' === typeof sdk.prepare)
  })


  test('direct-list-public_holiday_v4_dto', async (t: any) => {
    if (liveScenariosActive()) { t.skip('Covered by live operation scenarios'); return }
    const setup = directSetup([{ id: 'direct01' }, { id: 'direct02' }])
    if (maybeSkipControl(t, 'direct', 'direct-list-public_holiday_v4_dto', setup.live)) return
    if (skipIfMissingIds(t, setup, ["country_code01","year01"], LIVE_STRICT)) return
    const { client, calls } = setup

    const params: any = {}
    const query: any = {}
    if (setup.live) {
      params.country_code = setup.idmap['country_code01']
      params.year = setup.idmap['year01']
    } else {
      params.country_code = 'direct01'
      params.year = 'direct02'
    }

    const result: any = await client.direct({
      path: 'api/v4/Holidays/{country_code}/{year}',
      method: 'GET',
      params,
      query,
    })

    if (setup.live) {
      if (!result.ok || result.status < 200 || result.status >= 300) {
        return void liveMiss(t, LIVE_STRICT, 'Live list failed: ' + describeLive(result))
      }
      if (!(Array.isArray(unwrapListData(result.data)))) {
        return void liveMiss(t, LIVE_STRICT, 'Live list returned no list: ' + describeLive(result))
      }
    } else {
      assert(result.ok === true)
      assert(result.status === 200)
      assert(null != result.data)
      const listArr = unwrapListData(result.data)
      assert(Array.isArray(listArr))
      assert(listArr!.length === 2)
      assert(calls.length === 1)
      assert(calls[0].init.method === 'GET')
      assert(calls[0].url.includes('direct01'))
      assert(calls[0].url.includes('direct02'))
    }
  })

})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function liveScenariosActive() { return false && process.env.NAGER_DATE_SDK_TEST_LIVE === 'TRUE' }
function directSetup(mockres?: any) {
  const calls: any[] = []

  const env = envOverride({
    'NAGER_DATE_SDK_TEST_PUBLIC_HOLIDAY_V4_DTO_ENTID': {},
    'NAGER_DATE_SDK_TEST_LIVE': 'FALSE',
    'NAGER_DATE_SDK_SERVER_BASE': "",
  })

  const live = 'TRUE' === env.NAGER_DATE_SDK_TEST_LIVE

  if (live) {
    const transport = createLiveTransport()
    // Merged so the generated fields win: sdk-test-control.json's
    // test.client.options adds to the live client, it does not redirect it.
    const client = new NagerDateSdkSDK(
      Object.assign({}, liveClientOptions(), { system: { fetch: transport.fetch },
      server: {
        base: env.NAGER_DATE_SDK_SERVER_BASE,
      },
      }))

    let idmap: any = env['NAGER_DATE_SDK_TEST_PUBLIC_HOLIDAY_V4_DTO_ENTID']
    if ('string' === typeof idmap && idmap.startsWith('{')) {
      idmap = JSON.parse(idmap)
    }

    return { client, calls, live, idmap, transport }
  }

  const mockFetch = async (url: string, init: any) => {
    calls.push({ url, init })
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      json: async () => (null != mockres ? mockres : { id: 'direct01' }),
    }
  }

  const client = new NagerDateSdkSDK({
    base: 'http://localhost:8080',
    system: { fetch: mockFetch },
  })

  return { client, calls, live, idmap: {} as any }
}

// direct() returns the raw response body. List endpoints often wrap the
// array in an envelope (e.g. { data: [...] }, { entities: [...] },
// { pagination, data: [...] }). The test transforms the raw body to
// extract the first array — either the body itself or the first array
// property of an envelope object.
function unwrapListData(data: any): any[] | null {
  if (Array.isArray(data)) return data
  if (data && 'object' === typeof data) {
    for (const v of Object.values(data)) {
      if (Array.isArray(v)) return v as any[]
    }
  }
  return null
}
  
