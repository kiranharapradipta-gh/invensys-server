import { db } from "./src/db"

const start = async () => {

  console.log('starting test')

  const items = await db.get('barang')
  const updated = items.map((item: any) => {
    item.divisionid = 1
    return item
  })
  await db.set('barang', updated)

  return 'finished'

}

start().then(res => console.log(res))