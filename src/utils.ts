import { unlink, writeFile } from "fs/promises"

export const server = 'http://185.227.134.39:4120/'

export const saveimage = async (data: any) => {
  if ( !data ) return 'default-image.jpg'
  const buffer = Buffer.from(data)
  const filename = `${new Date().getTime()}.jpg`
  const filepath = `${process.cwd()}/src/uploads/${filename}`

  await writeFile(filepath, buffer)

  return filename
}

export const deleteimages = async (images: string[], x: number = 0) => {
  const currentimage = images.shift()
  if ( ! currentimage ) return true
  try {
    await unlink(`src/uploads/${currentimage}`)
    console.log(currentimage, 'deleted!')
  } catch (e) {
    console.error(e)
  }
  await deleteimages(images, x++)
}

export const sendtowhatsapp = async (type: 'text'|'image', data: any) => {
  console.log('sending to whatsapp')
  const body: any = {
    messaging_product: 'whatsapp',
    to: 6289633948126
  }
  if ( type == 'text' ) {
    body.type = 'text'
    body.text = {
      body: data.text || ''
    }
  }
  if ( type == 'image' ) {
    body.type = 'image'
    body.image = {
      link: data.image,
      caption: data.caption || ''
    }
  }
  const res = await fetch('https://graph.facebook.com/v22.0/495069927028672/messages', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer EAAJyiiK4h10BO9NgdZBfN2lEsl1cxKFVJGFDjkMqaDwblPUQ3YkNJtu5ZAW0FmKEY8ay5tEeJDfe3IqxtTsLeU9OFrYc79mu1XnRieoSMTJNrDuLqYxTMsLmfUt7NL0Uvez0quYukEzAZBms0tVFlSiQtwqrASbFT6LZB9SGaDWKDBhoU0W2qmWdWKkp3E9FEgZDZD',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const json = await res.json()
  console.log(json)
  return json
}