import { ID, Query } from 'appwrite'
import { tablesDB } from './appwrite'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const tableId = import.meta.env.VITE_APPWRITE_SUBJECTS_ID

// Get all species
export async function getSubjects() {
  const result = await tablesDB.listRows({
    databaseId: databaseId,
    tableId: tableId,
    queries: [Query.limit(100)],
  })
  return result.rows
}

// Get the 5 species for today.
// Everyone gets the same ones, and they change at midnight.
export async function getDailySubjects() {
  const all = await getSubjects()

  // Today as a number, for example 2026-10-27 becomes 20261027
  const today = new Date()
  const dayNumber =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  // Give every species a score based on today's number, then sort by it.
  // The same day always gives the same order.
  const scored = []
  for (let i = 0; i < all.length; i++) {
    const score = (dayNumber * (i + 7)) % 9973
    scored.push({ subject: all[i], score: score })
  }

  scored.sort((a, b) => a.score - b.score)

  const chosen = []
  for (let i = 0; i < scored.length && i < 5; i++) {
    chosen.push(scored[i].subject)
  }

  return chosen
}

// Get one species
export async function getSubject(id) {
  return await tablesDB.getRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: id,
  })
}

// Create a new species
export async function createSubject(data) {
  return await tablesDB.createRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: ID.unique(),
    data: data,
  })
}

// Update a species
export async function updateSubject(id, data) {
  return await tablesDB.updateRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: id,
    data: data,
  })
}

// Delete a species
export async function deleteSubject(id) {
  return await tablesDB.deleteRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: id,
  })
}