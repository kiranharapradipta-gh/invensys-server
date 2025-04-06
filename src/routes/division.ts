import { Router } from "express";
import { db } from "../db";
import { Division } from "../types";

const x = Router()

x.get('/', async (req, res) => {
  const divisions = await db.get('divisi')
  res.json(divisions)
})

x.post('/', async (req, res) => {
  const divisions = await db.get('divisi')

  const newdivision = { id: 0, name: req.body.name }

  if ( ! divisions . length ) newdivision . id = 1
  else {
    const lastdivision = divisions.reverse()[0]
    const lastdivisionid = lastdivision.id+1
    newdivision . id = lastdivisionid
    divisions.reverse()
  }

  divisions.push(newdivision)

  await db.set('divisi', divisions)
  
  res.json({ created: true })
})

x.get('/:id/delete', async (req, res) => {
  const divisions: Division[] = await db.get('divisi')
  const updated = divisions.filter(division => division.id != parseInt(req.params.id))
  await db.set('divisi', updated)
  res.json({ deleted: true })
})

export default x