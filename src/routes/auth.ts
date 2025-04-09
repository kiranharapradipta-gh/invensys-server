import { Router } from "express"
import { db } from "../db"

const x = Router()

x.post('/login', async (req, res) => {
  const { username, password, deviceid } = req.body
  console.log('login:', req.body)
  if ( ! username && ! password ) res.json({ ok: false, message: 'username and password are required' })
  else {
    const user = await db.single('orang', user => user.username == username && user.password == password)
    if ( ! user ) res.json({ ok: false, message: 'invalid credentials' })
    else {
      const authenticated = await db.get('authenticated')
      if ( ! authenticated.find((a: any) => a.deviceid == deviceid) ) await db.set('authenticated', [ ...authenticated, { deviceid, userid: user.id } ])
      console.log('authenticated')
      res.json({ ok: true })
    }
  }
})

x.post('/authenticate', async (req, res) => {
  const data = await db.single('authenticated', data => data.deviceid == req.body.id)
  if ( ! data ) res.json({ ok: false, message: 'Not authenticated', data: null })
  else {
    const user = await db.single('orang', user => user.id == data.userid)
    data . user = user
    res.json({ ok: Boolean(data), data })
  }
})

x.post('/logout', async (req, res) => {
  console.log('logout', req.body.id)
  const authenticated = await db.get('authenticated')
  const updated = authenticated.filter((a: any) => a.deviceid != req.body.id)
  await db.set('authenticated', updated)
  res.json({ ok: true })
})

export default x