import { Router } from "express";

import { db, DB } from '../db'

const x = Router();

x.get("/", async (req, res) => {
  const data = await db.get('kategori')
  res.json(data);
});

x.get("/:id/delete", async (req, res) => {
  console.log('delete category', req.params.id)
  const data = await db.get('kategori')
  const filtered = data.filter((category: any) => category.id != req.params.id)
  await db.set('kategori', filtered)
  res.json({ updated: true })
});

x.post("/", async (req, res) => {

  console.log('body', req.body)
  
  const categories = await db.get('kategori')
  
  const newcategory = { id: 0, name: req.body.name }
  
  if ( !categories.length ) newcategory.id = 1
  else {
    const lastcategory = categories[categories.length-1]
    const lastid = lastcategory.id
    newcategory.id = lastid+1
  }

  categories.push(newcategory)

  db.set('kategori', categories)

  res.json({ ok: true })
});

x.post('/update', async (req, res) => {
  const categories = await db.get('kategori')
  const category = categories.find((category: any) => category.id == req.body.id)
  if (category) {
    category.name = req.body.name
    db.set('kategori', categories)
    res.json({ updated: true })
  } else {
    res.json({ error: 'Category not found' })
  }

})

export default x;