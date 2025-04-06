import { Router } from "express"
import { db } from "../db"

const x = Router()

x.get('/', async (req, res) => {
  const data = await db.get('role')
  res.json(data)
})

export default x