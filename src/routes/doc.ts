import { Router } from "express";
import { db } from "../db";
import { Item } from "../types";
import { saveimage } from "../utils";

const x = Router()

x.get('/', async (req, res) => {
  const data = await db.get('dokumen')
  res.json(data)
})

x.post('/', async (req, res) => {

  const { itemid, type, quantity, image, location, description, divisionid, peopleid, userid } = req.body

  const docs: any[] = await db.get('dokumen')
  const items: Item[] = await db.get('barang')
  
  const filename = await saveimage(image.data)

  const lastdoc = docs.reverse()[0]
  const lastdocid = lastdoc.id
  const newdoc = {
    id: lastdocid? parseInt(lastdocid)+1:1,
    itemid,
    type,
    location: location ?? null,
    divisionid: divisionid ?? null,
    peopleid: peopleid ?? null,
    userid: userid ?? null,
    quantity,
    description,
    image: filename,
    date: new Date().toDateString()
  }
  docs.reverse()
  docs.push(newdoc)
  await db.set('dokumen', docs)

  const updateditems = items.map(item => {
    if ( item.id == itemid ) {
      item.quantity
      = type == 'masuk'
      ? item.quantity + parseInt(quantity)
      : type == 'keluar'
      ? item.quantity - parseInt(quantity)
      : quantity
    }
    return item
  })
  await db.set('barang', updateditems)

  res.json({ updated: true, id: newdoc.id })
})

export default x