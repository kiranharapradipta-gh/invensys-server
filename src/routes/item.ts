import { Router } from "express";
import { db } from "../db";
import { Item } from "../types";
import { unlink, writeFile } from "fs/promises";
import { saveimage } from "../utils";

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

  const filename = await saveimage(req.body.image?.data)

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

  res.json({ created: true, id: newitem.id })


})

x.post('/:id/update', async (req, res) => {
  const key = Object.keys(req.body)[0]
  const value = Object.values(req.body)[0]
  if ( ! key && ! value ) res.json({ ok: false, message: 'invalid payload' })
  const items: Item[] = await db.get('barang')
  const updated = items.map((item: any) => {
    if ( item.id == parseInt(req.params.id) ) item[ key ] = value
    return item
  })
  console.log('updating item', key, value, updated)
  await db.set('barang', updated)
  res.json({ updated: true })
})

x.get('/:id/delete', async (req, res) => {
  const items: Item[] = await db.get('barang')
  const selected = items.find(item => item.id == parseInt(req.params.id))
  if ( ! selected ) res.json({ ok: false, message: 'item not found' })
  else {
    const updated = items.filter(item => item.id != parseInt(req.params.id))
    await unlink(`src/uploads/${selected.image}`)
    await db.set('barang', updated)
    res.json({ deleted: true })
  }
})

export default x