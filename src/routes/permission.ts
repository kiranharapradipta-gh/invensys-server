import { Router } from "express";
import { db } from "../db";

const x = Router()

x.get('/', async (req, res) => {
  const permissions = await db.get('permission')
  res.json(permissions)
})

x.post('/user', async (req, res) => {
  const userpermissionids = req.body.ids
  const permissions = await db.get('permission')
  const userpermissions = permissions.filter((permission: any) => userpermissionids.includes(permission.id))
  res.json(userpermissions)
})

export default x