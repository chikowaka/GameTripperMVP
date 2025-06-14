import { openDB } from 'idb'

export const imageDB = await openDB('RamenAppDB', 1, {
  upgrade(db) {
    db.createObjectStore('images', { keyPath: 'id' })
  },
})

export async function saveImage(id: string, blob: Blob) {
  return imageDB.put('images', { id, blob })
}

export async function getImage(id: string): Promise<Blob | undefined> {
  const record = await imageDB.get('images', id)
  return record?.blob
}