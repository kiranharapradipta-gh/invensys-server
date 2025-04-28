import { Router } from "express";
import { db } from "../db";
import { Item } from "../types";
import { saveimage, sendtowhatsapp, server } from "../utils";

const x = Router()

x.get('/', async (req, res) => {
  const data = await db.get('dokumen')
  res.json(data)
})

x.post('/', async (req, res) => {

  const { itemid, type, quantity, description, userid } = req.body

  console.log('status', req.body.status)

  const units = await db.get('unit')
  const docs: any[] = await db.get('dokumen')
  const items: Item[] = await db.get('barang')
  const item = items.find(item => item.id == itemid)
  const user = await db.single('orang', user => user.id == userid)
  
  const filename = await saveimage(req.body?.image?.data)

  const lastdoc = docs.pop()

  const lastdocid = lastdoc? lastdoc.id:1
  const parsedquantity
  = type == 'penyesuaian'
  ? req.body?.status == '+'
    ? + quantity
    : - quantity
  : type == 'masuk'
  ? +quantity
  : type == 'keluar'
  ? -quantity
  : 0
  
  const newdoc = {
    id: lastdocid? parseInt(lastdocid)+1:1,
    itemid,
    type,
    userid: userid,
    location: req.body?.location ?? null,
    divisionid: req.body?.divisionid ?? null,
    peopleid: req.body?.peopleid ?? null,
    quantity: parsedquantity,
    description,
    image: filename,
    date: new Date().toDateString()
  }

  if ( lastdoc ) docs.push(lastdoc)
  
  docs.push(newdoc)

  await db.set('dokumen', docs)

  const updateditems = items.map(item => {
    if ( item.id == itemid ) {
      if ( type == 'penyesuaian' ) {
        if ( req.body?.status == '+' ) item.quantity = item.quantity + quantity
        if ( req.body?.status == '-' ) item.quantity = item.quantity - quantity
      }
      if ( type == 'masuk' ) item.quantity = item.quantity + quantity
      if ( type == 'keluar' ) item.quantity = item.quantity - quantity
    }
    return item
  })

  await db.set('barang', updateditems)

  await sendtowhatsapp('image', {
    image: server+filename,
    caption: `
Transaksi *${type}* dilakukan oleh *${user?.name}*
*${type[0].toUpperCase() + type.slice(1)}*: *${quantity} ${units.find((unit: any) => unit.id == item?.unitid)?.name} ${item?.name}* dengan keterangan berikut.
\`\`\`${description}\`\`\`
    `
  })

  res.json({ updated: true, id: newdoc.id })
})

export default x