import { Router } from "express";
import { db } from "../db";

const x = Router()

x.get('/', async (req, res) => {
  const data = await db.get('unit')
  res.json(data)
})

x.post('/', async (req, res) => {
  console.log('body', req.body)

  const units = await db.get('unit')

  const newunit = { id: 0, name: req.body.name }

  if ( ! units . length ) newunit . id = 1
  else {
    const lastunit = units . reverse() [0]
    const lastid = lastunit . id + 1
    newunit . id = lastid
    units . reverse()
  }

  units . push ( newunit )

  db . set ( 'unit', units ) . then ( () => console . log ( 'unit updated' ) )

  res.json({ created: true })
})

export default x