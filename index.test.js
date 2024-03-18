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
