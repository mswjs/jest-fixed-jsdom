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

test('exposes "EventTarget"', () => {
  expect(globalThis).toHaveProperty('EventTarget')
  expect(() => new EventTarget()).not.toThrow()

  const target = new EventTarget()
  const symbols = Object.getOwnPropertySymbols(target).map(
    (symbol) => symbol.description,
  )

  // EventTarget must not be implemented by JSDOM.
  expect(symbols).not.toContain('impl')

  // In Node.js, EventTarget keeps events behind the kEvents symbol.
  expect(symbols).toContain('kEvents')
})

test('exposes "Event"', () => {
  expect(globalThis).toHaveProperty('Event')
  expect(() => new Event('click')).not.toThrow()

  const event = new Event('click')
  const symbols = Object.getOwnPropertySymbols(event).map(
    (symbol) => symbol.description,
  )

  // The "impl" symbol is added by JSDOM.
  expect(symbols).not.toContain('impl')
  // Node.js expects events to have the "type" symbol.
  expect(symbols).toContain('type')

  /**
   * Perform a basic "isEvent()" check that Node.js has.
   * @see https://github.com/nodejs/node/blob/3a456c6db802b5b25594d3a9d235d4989e9f7829/lib/internal/event_target.js#L96
   */
  expect(event[symbols.find((description) => description === 'type')]).toBe(
    'click',
  )
})

test('exposes "MessageEvent"', () => {
  expect(globalThis).toHaveProperty('MessageEvent')
  expect(() => new MessageEvent('click')).not.toThrow()

  const event = new MessageEvent('message')
  const symbols = Object.getOwnPropertySymbols(event).map(
    (symbol) => symbol.description,
  )

  // The "impl" symbol is added by JSDOM.
  expect(symbols).not.toContain('impl')
  // Node.js expects events to have the "type" symbol.
  expect(symbols).toContain('type')

  /**
   * Perform a basic "isEvent()" check that Node.js has.
   * @see https://github.com/nodejs/node/blob/3a456c6db802b5b25594d3a9d235d4989e9f7829/lib/internal/event_target.js#L96
   */
  expect(event[symbols.find((description) => description === 'type')]).toBe(
    'message',
  )
})
