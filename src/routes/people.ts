import { Router } from "express";

import { db } from '../db'

const x = Router();

x.get("/", async (req, res) => {
  const data = await db.get('orang')
  res.json(data);
});

x.get("/:id/delete", async (req, res) => {
  const data = await db.get('orang')
  const filtered = data.filter((people: any) => people.id != req.params.id)
  await db.set('orang', filtered)
  res.json({ updated: true })
});

x.post("/", async (req, res) => {
  
  const peoples = await db.get('orang')
  
  const newpeople = {
    id: 0,
    name: req.body.name,
    username: req.body.name?.replace(' ', ''),
    password: req.body.name?.replace(' ', ''),
    divisionid: 0,
    roleid: 3,
    permissionids: []
  }
  
  if ( !peoples.length ) newpeople.id = 1
  else {
    const lastpeople = peoples[peoples.length-1]
    const lastid = lastpeople.id
    newpeople.id = lastid+1
  }

  peoples.push(newpeople)

  db.set('orang', peoples)

  res.json({ ok: true })
});

x.post('/update-role', async (req, res) => {
  const peoples = await db.get('orang')
  const updated = peoples.map((people: any) => {
    if ( people.id == req.body.userid ) people.roleid = req.body.roleid
    return people
  })
  await db.set('orang', updated)
  res.json({ ok: true })
})

x.post('/update-permissions', async (req, res) => {
  const peoples = await db.get('orang')
  const updated = peoples.map((people: any) => {
    if ( people.id == req.body.userid ) people.permissionids = req.body.permissionids
    return people
  })
  await db.set('orang', updated)
  res.json({ ok: true })
})

// pass

export default x;