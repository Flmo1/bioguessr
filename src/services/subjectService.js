import { tablesDB } from './appwrite'

export async function getSubjects() {
  const result = await tablesDB.listRows({
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    tableId: import.meta.env.VITE_APPWRITE_SUBJECTS_ID,
  })
  return result.rows
}