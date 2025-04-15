import { Router } from "express";
import { db } from "../db";
import { Item } from "../types";
import { unlink } from "fs/promises";
import { deleteimages, saveimage, sendtowhatsapp, server } from "../utils";

const x = Router()

x.get('/', async (req, res) => {
  const data = await db.get('barang')
  res.json(data)
})

x.post('/', async (req, res) => {

  console.log('saving item')

  const items = await db.get('barang')

  const newitem = { id: 0, ...req.body }

  // setting the id
  if ( !items.length ) newitem . id = 1
  else {
    const lastitem = items.reverse()[0]
    const lastitemid = lastitem.id+1
    newitem . id = lastitemid
  }

  const filename  = await saveimage(req.body.image?.data)
  const unit      = await db.single('unit', unit => unit.id == newitem.unitid)
  const category  = await db.single('kategori', category => category.id == newitem.categoryid)
  const user      = await db.single('orang', user => user.id == req.body.userid)

  // updating image name
  newitem . image = filename
  
  // append new item to items
  const itemsupdated = [...items.reverse(), newitem]

  // re-write the items
  db.set('barang', itemsupdated)

  const docs = await db.get('dokumen')

  const newdoc = {
    id: 0,
    itemid: newitem . id,
    userid: req.body.userid,
    type: 'masuk',
    divisionid: null,
    receiver: null,
    quantity: req.body.quantity,
    description: 'Penambahan barang: ' + req.body.name,
    image: newitem . image,
    date: new Date().toDateString()
  }

  if ( ! docs . length ) newdoc . id = 1

  else {
    const lastdoc = docs.reverse()[0]
    const lastdocid = lastdoc.id+1
    newdoc . id = lastdocid

  }

  const docsupdated = [...docs.reverse(), newdoc]

  db.set('dokumen', docsupdated)

  // sending to whatsapp
  await sendtowhatsapp('image', {
    image: server+filename,
    caption: `
*Penambahan barang* oleh *${user.name}*
*${newitem.quantity} ${unit?.name}* *${newitem.name}* di kategori *${category?.name}* dengan keterangan berikut.
\`\`\`${newitem.description.length? newitem.description : 'Tidak ada keterangan'}\`\`\`
  `.slice(0, 4093)
  })

  res.json({ created: true, id: newitem.id })

})

x.post('/update', async (req, res) => {
  const { userid, itemid } = req.body
  delete req.body.userid
  delete req.body.itemid
  const user = await db.single('orang', user => user.id == userid)
  const key = Object.keys(req.body)[0] as keyof Item
  const translatedkeys
  = key == 'code'
  ? 'kode'
  : key == 'name'
  ? 'nama'
  : key == 'quantity'
  ? 'kuantitas'
  : key == 'categoryid'
  ? 'kategori'
  : key == 'description'
  ? 'keterangan'
  : key
  const value = Object.values(req.body)[0]
  if ( ! key && ! value ) res.json({ ok: false, message: 'invalid payload' })
  const items: Item[] = await db.get('barang')
  const item = items.find(item => item.id == itemid)
  const updated = items.map((item: any) => {
    if ( item.id == parseInt(itemid) ) item[ key ] = value
    return item
  })
  await db.set('barang', updated)
  await sendtowhatsapp('text', {
    text: `
*Perubahan ${translatedkeys}* barang oleh ${user?.name}
dari ${item?.[key]} menjadi ${value}
    `
  })
  res.json({ updated: true })
})

x.post('/delete', async (req, res) => {
  const user = await db.single('orang', user => user.id == req.body.userid)
  const items: Item[] = await db.get('barang')
  const selected = items.find(item => item.id == parseInt(req.body.itemid))
  if ( ! selected ) res.json({ ok: false, message: 'item not found' })
  else {
    // delete the item from the items array
    const updated = items.filter(item => item.id != parseInt(req.body.itemid))
    const docs: any[] = await db.get('dokumen')
    const selecteddocs = docs.filter(doc => doc.itemid == parseInt(req.body.itemid))
    const docsimages = selecteddocs.map(doc => doc.image)
    await deleteimages(docsimages)
    // delete the document from the documents array
    const docsupdated = docs.filter(doc => doc.itemid != parseInt(req.body.itemid))
    await db.set('dokumen', docsupdated)
    await db.set('barang', updated)
    await sendtowhatsapp('image', {
      image: server + selected.image,
      caption: `
Penghapusan barang oleh *${user.name}*.
${selected.name} telah dihapus.
      `
    })
    res.json({ deleted: true })
  }
})

export default x