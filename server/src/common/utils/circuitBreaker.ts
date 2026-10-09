type ICircuitBreakerOptions = { threshold: number; cooldownMs: number }

/**
 * Coupe les appels après `threshold` échecs consécutifs, pendant `cooldownMs`.
 * À la fin de la fenêtre, un seul appel d'essai passe : un succès referme le circuit, un échec le rouvre.
 */
export class CircuitBreaker {
  #getOptions: () => ICircuitBreakerOptions
  #now: () => number
  #consecutiveFailures = 0
  #openedAt: number | null = null
  #trialInFlight = false

  constructor(getOptions: () => ICircuitBreakerOptions, now: () => number = Date.now) {
    this.#getOptions = getOptions
    this.#now = now
  }

  tryAcquire(): boolean {
    if (this.#openedAt === null) {
      return true
    }
    if (this.#trialInFlight || this.#now() - this.#openedAt < this.#getOptions().cooldownMs) {
      return false
    }
    this.#trialInFlight = true
    return true
  }

  recordSuccess(): void {
    this.#consecutiveFailures = 0
    this.#openedAt = null
    this.#trialInFlight = false
  }

  /** Renvoie `true` quand cet échec ouvre le circuit. */
  recordFailure(): boolean {
    if (this.#trialInFlight) {
      this.#trialInFlight = false
      this.#openedAt = this.#now()
      return true
    }
    this.#consecutiveFailures++
    if (this.#openedAt === null && this.#consecutiveFailures >= this.#getOptions().threshold) {
      this.#openedAt = this.#now()
      return true
    }
    return false
  }

  /** Libère l'appel d'essai sans conclure, quand l'appel s'est arrêté pour une raison propre à BAL. */
  release(): void {
    this.#trialInFlight = false
  }
}
