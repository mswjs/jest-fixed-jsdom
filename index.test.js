const { URL: BuiltinURL } = require('node:url')
const {
  BroadcastChannel: BuiltinBroadcastChannel,
} = require('node:worker_threads')

test('exposes "Blob"', async () => {
  expect(globalThis).toHaveProperty('Blob')
  expect(() => new Blob()).not.toThrow()
  await expect(new Blob(['hello']).text()).resolves.toBe('hello')
})

test('exposes "TextEncoder"', () => {
  expect(globalThis).toHaveProperty('TextEncoder')
  expect(() => new TextEncoder()).not.toThrow()
  expect(Buffer.from(new TextEncoder().encode('hello'))).toEqual(
    Buffer.from(new Uint8Array([104, 101, 108, 108, 111])),
  )
})

test('exposes "TextDecoder"', () => {
  expect(globalThis).toHaveProperty('TextDecoder')
  expect(() => new TextDecoder()).not.toThrow()
  expect(
    new TextDecoder().decode(new Uint8Array([104, 101, 108, 108, 111])),
  ).toBe('hello')
})

test('exposes "TextEncoderStream"', async () => {
  expect(globalThis).toHaveProperty('TextEncoderStream')
  expect(() => new TextEncoderStream()).not.toThrow()

  const stream = new TextEncoderStream()
  const writer = stream.writable.getWriter()
  writer.write('hello')
  writer.close()

  const reader = stream.readable.getReader()
  const chunks = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(...value)
  }
  expect(Buffer.from(chunks)).toEqual(
    Buffer.from(new Uint8Array([104, 101, 108, 108, 111])),
  )
})

test('exposes "TextDecoderStream"', async () => {
  expect(globalThis).toHaveProperty('TextDecoderStream')
  expect(() => new TextDecoderStream()).not.toThrow()

  const stream = new TextDecoderStream()
  const writer = stream.writable.getWriter()
  writer.write(new Uint8Array([104, 101, 108, 108, 111]))
  writer.close()

  const reader = stream.readable.getReader()
  const chunks = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  expect(chunks.join('')).toBe('hello')
})

test('exposes "ReadableStream"', () => {
  expect(globalThis).toHaveProperty('ReadableStream')
  expect(() => new ReadableStream()).not.toThrow()
})

test('exposes "Headers"', () => {
  expect(globalThis).toHaveProperty('Headers')
  expect(() => new Headers()).not.toThrow()
  expect(new Headers([['a', 'b']]).get('a')).toBe('b')
})

test('exposes "FormData"', () => {
  expect(globalThis).toHaveProperty('FormData')
  expect(() => new FormData()).not.toThrow()

  const data = new FormData()
  data.set('a', 'b')
  expect(data.get('a')).toBe('b')
})

test('exposes "Request"', async () => {
  expect(globalThis).toHaveProperty('Request')
  expect(() => new Request('https://example.com')).not.toThrow()

  const request = new Request('https://example.com', {
    method: 'POST',
    body: 'hello world',
  })
  expect(await request.text()).toBe('hello world')
})

test('exposes "Response"', async () => {
  expect(globalThis).toHaveProperty('Response')
  expect(() => new Response('hello')).not.toThrow()

  const response = new Response('hello')
  expect(await response.text()).toBe('hello')
})

test('exposes "structuredClone"', async () => {
  expect(globalThis).toHaveProperty('structuredClone')
  expect(() => structuredClone('hello')).not.toThrow()
  expect(structuredClone('hello')).toBe('hello')

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('hello')
      controller.close()
    },
  })
  /**
   * @note Jest/JSDOM failes cloning ReadableStream because they use
   * "core-js" to polyfill "structuredClone()" and it doesn't support it.
   * @see https://github.com/mswjs/msw/issues/1929#issuecomment-1908535966
   */
  const clone = structuredClone(stream, { transfer: [stream] })
  expect(clone).toBeInstanceOf(ReadableStream)

  const chunks = []
  const reader = clone.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  expect(chunks).toEqual(['hello'])
})

test('exposes "URL"', () => {
  expect(globalThis).toHaveProperty('URL')
  expect(new URL('http://localhost')).toBeInstanceOf(BuiltinURL)
})

test('exposes "URLSearchParams" and makes it mockable', () => {
  jest
    .spyOn(URLSearchParams.prototype, 'has')
    .mockImplementation((key) => key === 'mocked_flag')

  expect(globalThis).toHaveProperty('URLSearchParams')
  expect(
    new URL('http://localhost?other_non_mocked_flag').searchParams.has(
      'other_non_mocked_flag',
    ),
  ).toBe(false)
  expect(
    new URL('http://localhost?other_non_mocked_flag').searchParams.has(
      'mocked_flag',
    ),
  ).toBe(true)
})

test('exposes "BroadcastChannel"', () => {
  expect(globalThis).toHaveProperty('BroadcastChannel')

  const channel = new BroadcastChannel('foo')
  expect(channel).toBeInstanceOf(BuiltinBroadcastChannel)
  channel.unref()
})
