import { describe, expect, it } from "vitest"

import { CircuitBreaker } from "../../../src/common/utils/circuitBreaker"

const createBreaker = () => {
  const clock = { now: 0 }
  const breaker = new CircuitBreaker(
    () => ({ threshold: 3, cooldownMs: 1_000 }),
    () => clock.now
  )
  return { breaker, clock }
}

const fail = (breaker: CircuitBreaker, times: number) => {
  for (let i = 0; i < times; i++) {
    breaker.tryAcquire()
    breaker.recordFailure()
  }
}

describe("CircuitBreaker", () => {
  it("ne s'ouvre qu'après le seuil d'échecs consécutifs", () => {
    const { breaker } = createBreaker()
    fail(breaker, 2)
    breaker.recordSuccess()
    fail(breaker, 2)
    expect(breaker.tryAcquire()).toBe(true)

    expect(breaker.recordFailure()).toBe(true)
    expect(breaker.tryAcquire()).toBe(false)
  })

  it("laisse passer un seul appel d'essai après la fenêtre", () => {
    const { breaker, clock } = createBreaker()
    fail(breaker, 3)

    clock.now = 999
    expect(breaker.tryAcquire()).toBe(false)
    clock.now = 1_000
    expect(breaker.tryAcquire()).toBe(true)
    expect(breaker.tryAcquire()).toBe(false)
  })

  it("se referme sur un essai réussi", () => {
    const { breaker, clock } = createBreaker()
    fail(breaker, 3)
    clock.now = 1_000
    breaker.tryAcquire()
    breaker.recordSuccess()

    expect(breaker.tryAcquire()).toBe(true)
    expect(breaker.tryAcquire()).toBe(true)
  })

  it("se rouvre pour une nouvelle fenêtre sur un essai en échec", () => {
    const { breaker, clock } = createBreaker()
    fail(breaker, 3)
    clock.now = 1_000
    breaker.tryAcquire()

    expect(breaker.recordFailure()).toBe(true)
    clock.now = 1_999
    expect(breaker.tryAcquire()).toBe(false)
    clock.now = 2_000
    expect(breaker.tryAcquire()).toBe(true)
  })

  it("libère l'essai sans refermer le circuit", () => {
    const { breaker, clock } = createBreaker()
    fail(breaker, 3)
    clock.now = 1_000
    breaker.tryAcquire()
    breaker.release()

    expect(breaker.tryAcquire()).toBe(true)
    expect(breaker.tryAcquire()).toBe(false)
  })
})
