import { ID } from 'appwrite'
import { account } from './appwrite'

// Who is logged in right now? Returns null if nobody is.
export async function getUser() {
  try {
    return await account.get()
  } catch {
    return null
  }
}

export function login(email, password) {
  return account.createEmailPasswordSession({ email, password })
}

export function logout() {
  return account.deleteSession({ sessionId: 'current' })
}

// Make a new account
export function register(name, email, password) {
  return account.create({
    userId: ID.unique(),
    email: email,
    password: password,
    name: name,
  })
}