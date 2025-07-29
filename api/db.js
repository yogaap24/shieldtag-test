import { join, dirname } from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const defaultData = { users: [] }
const db = new Low(adapter, defaultData)

await db.read()

// Hanya write jika data tidak ada
if (!db.data) {
  db.data = { users: [] }
  await db.write()
}

export default db