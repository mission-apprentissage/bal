const PLAUSIBLE_EVENT_URL = "https://plausible.io/api/event"
const FORWARDED_HEADERS = ["content-type", "user-agent", "x-forwarded-for"]
const TIMEOUT_MS = 30_000
// Un pageview pèse quelques centaines d'octets. nginx ne limite pas la taille du corps sur l'UI (client_max_body_size 0).
const MAX_BODY_BYTES = 64 * 1024

async function readBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) {
    return ""
  }

  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  return Buffer.concat(chunks).toString("utf8")
}

// Prend le pas sur le rewrite de withPlausibleProxy (les route handlers passent avant les rewrites afterFiles).
// Ce rewrite passe par le proxy httpxy de Next, qui attache assez de listeners `close` à chaque réponse pour dépasser
// la limite de 10 une fois Sentry ajouté (mission-apprentissage/labonnealternance#5724).
export async function POST(request: Request): Promise<Response> {
  const body = await readBody(request)
  if (body === null) {
    return new Response(null, { status: 413 })
  }

  const headers = new Headers()
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name)
    if (value) {
      headers.set(name, value)
    }
  }

  try {
    const response = await fetch(PLAUSIBLE_EVENT_URL, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    return new Response(response.body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "text/plain" },
    })
  } catch (error) {
    console.error("Failed to proxy Plausible event", error)
    return new Response(null, { status: 502 })
  }
}
