
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { NagerDateSdkSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = NagerDateSdkSDK.test()
    equal(testsdk instanceof NagerDateSdkSDK, true,
      'NagerDateSdkSDK.test() must return a client synchronously')
  })

})
