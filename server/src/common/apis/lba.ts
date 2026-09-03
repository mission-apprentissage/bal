import { internal } from "@hapi/boom"
import axios, { isAxiosError } from "axios"
import config from "@/config"
import { mapWithConcurrency, sleep } from "../utils/asyncUtils"

const LIMIT_TRAINING_LINKS_PER_REQUEST = 100
const MAX_CONCURRENT_REQUESTS = 3
const RETRY_DELAYS_MS = [1_000, 5_000]

const client = axios.create({
  baseURL: config.lba.baseURL,
  timeout: 60_000,
})

export interface TrainingLinkData {
  id: string
  cle_ministere_educatif: string | null
  mef: string | null
  cfd: string | null
  rncp: string | null
  code_postal: string | null
  uai_formateur: string | null
  uai_formateur_responsable: string | null
  code_insee: string | null
  siret_lieu_formation?: string | null
  siret_formateur?: string | null
  siret_formateur_responsable?: string | null
}

interface TrainingLink {
  id: string
  lien_prdv: string
  lien_lba: string
}

function isRetryableError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false
  }

  // Erreur réseau (timeout, connexion coupée) ou erreur serveur transitoire
  return error.response == null || error.response.status >= 500
}

async function postTrainingLinksChunk(chunk: TrainingLinkData[], signal: AbortSignal | null): Promise<TrainingLink[]> {
  const opts = signal ? { signal: signal } : undefined

  for (let attempt = 0; ; attempt++) {
    try {
      const response = await client.post<TrainingLink[]>(`/api/traininglinks`, chunk, opts)
      return response.data
    } catch (error) {
      if (signal?.aborted || attempt >= RETRY_DELAYS_MS.length || !isRetryableError(error)) {
        throw error
      }
      await sleep(RETRY_DELAYS_MS[attempt], signal)
    }
  }
}

export const getTrainingLinks = async (data: TrainingLinkData[], signal: AbortSignal | null = null): Promise<TrainingLink[]> => {
  try {
    const chunks: TrainingLinkData[][] = []

    for (let i = 0; i < data.length; i += LIMIT_TRAINING_LINKS_PER_REQUEST) {
      chunks.push(data.slice(i, i + LIMIT_TRAINING_LINKS_PER_REQUEST))
    }

    const responses = await mapWithConcurrency(chunks, MAX_CONCURRENT_REQUESTS, async (chunk) => postTrainingLinksChunk(chunk, signal))

    return responses.flat()
  } catch (error) {
    if (isAxiosError(error)) {
      throw internal(
        `Erreur lors de la génération des liens de prises de rendez-vous. ${error.code ?? ""}: ${error.message}. Le serveur a répondu avec le message suivant : ${JSON.stringify(
          error.response?.data ?? null
        )}`,
        { error }
      )
    }

    throw internal(`Erreur lors de la génération des liens de prises de rendez-vous. ${error instanceof Error ? error.message : String(error)}`, { error })
  }
}
