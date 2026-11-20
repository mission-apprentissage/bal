import { ObjectId } from "mongodb"
import type { IUser } from "shared/models/user.model"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { generateKey, generateSecretHash } from "../../common/utils/cryptoUtils"
import { createUserTokenSimple } from "../../common/utils/jwtUtils"
import { hashPassword } from "../server/utils/password.utils"

type ICreateUser = Pick<IUser, "email" | "password"> & Partial<Pick<IUser, "is_admin" | "is_support">>

export const createUser = async (data: ICreateUser) => {
  const _id = new ObjectId()
  const password = hashPassword(data.password)
  const now = new Date()

  const user: IUser = {
    is_admin: data.is_admin ?? false,
    is_support: data.is_support ?? false,
    api_key: null,
    api_key_used_at: null,
    email: data.email,
    _id,
    password,
    updated_at: now,
    created_at: now,
  }
  const { insertedId: userId } = await getDbCollection("users").insertOne(user)

  return {
    ...user,
    _id: userId,
  }
}

export const updateUser = async (email: IUser["email"], data: Partial<IUser>): Promise<void> => {
  try {
    await getDbCollection("users").findOneAndUpdate(
      {
        email,
      },
      {
        $set: { ...data, updated_at: new Date() },
      }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Donne ("true") ou retire ("false") l'accès à l'export DECA. La valeur arrive en chaîne de la CLI :
// Boolean("false") vaut true, d'où le contrôle explicite. Retirer l'accès supprime le champ plutôt
// que de l'écrire à false, pour que seuls les comptes qui ont l'accès le portent.
export const setUserDecaExport = async (email: IUser["email"], value: string): Promise<void> => {
  if (value !== "true" && value !== "false") {
    throw new Error(`Valeur invalide : "${value}". Valeurs acceptées : "true" ou "false"`)
  }

  const updated_at = new Date()
  const update = value === "true" ? { $set: { is_deca_export: true, updated_at } } : { $set: { updated_at }, $unset: { is_deca_export: "" as const } }

  const { matchedCount } = await getDbCollection("users").updateOne({ email }, update)

  if (matchedCount === 0) {
    throw new Error(`Aucun utilisateur avec l'email ${email}`)
  }
}

export const generateApiKey = async (user: IUser) => {
  const generatedKey = generateKey()
  const secretHash = generateSecretHash(generatedKey)

  await updateUser(user.email, { api_key: secretHash, api_key_used_at: null })

  const token = createUserTokenSimple({
    payload: { _id: user._id, api_key: generatedKey },
    expiresIn: "365d",
  })

  return token
}
