const PLAUSIBLE_EVENT_URL = "https://plausible.io/api/event"
const FORWARDED_HEADERS = ["content-type", "user-agent", "x-forwarded-for"]
const TIMEOUT_MS = 30_000

// Prend le pas sur le rewrite de withPlausibleProxy (les route handlers passent avant les rewrites afterFiles).
// Ce rewrite passe par le proxy httpxy de Next, qui attache assez de listeners `close` à chaque réponse pour dépasser
// la limite de 10 une fois Sentry ajouté (mission-apprentissage/labonnealternance#5724).
export async function POST(request: Request): Promise<Response> {
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
      body: await request.text(),
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
