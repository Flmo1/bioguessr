import { ID } from 'appwrite'
import { tablesDB } from './appwrite'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const tableId = import.meta.env.VITE_APPWRITE_SUBJECTS_ID

// Get all species
export async function getSubjects() {
  const result = await tablesDB.listRows({
    databaseId: databaseId,
    tableId: tableId,
  })
  return result.rows
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