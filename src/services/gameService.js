import { ID, Query, Permission, Role } from 'appwrite'
import { tablesDB } from './appwrite'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const tableId = import.meta.env.VITE_APPWRITE_GAMES_ID

// Today as a text like "2026-10-27"
export function getToday() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return now.getFullYear() + '-' + month + '-' + day
}

// Save a finished game.
// The permissions mean only this user can change or delete their own result.
export async function saveGame(user, score) {
  return await tablesDB.createRow({
    databaseId: databaseId,
    tableId: tableId,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      userName: user.name,
      score: score,
      date: getToday(),
    },
    permissions: [
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  })
}

// Every score from today, so we can compare
export async function getTodayScores() {
  const result = await tablesDB.listRows({
    databaseId: databaseId,
    tableId: tableId,
    queries: [
      Query.equal('date', getToday()),
      Query.limit(100),
    ],
  })
  return result.rows
}