import { readFile, writeFile } from "fs/promises"

export type DB = 'barang'|'dokumen'|'divisi'|'kategori'|'unit'|'orang'|'pengguna'|'authenticated'|'permission'|'role'

const get = async (name: DB) => {
  const jsondata = await readFile(`src/data/${name}.json`, 'utf-8')
  return JSON.parse(jsondata)
}

const set = async (name: DB, newdata: any) => {
  await writeFile(`data/${name}.json`, JSON.stringify(newdata, null, 2))
}

const single = async (name: DB, condition: (item: any) => boolean) => {
  const data = await get(name)
  return data.find(condition)
}

export const db = { get, set, single }