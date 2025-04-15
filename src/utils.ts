import { unlink, writeFile } from "fs/promises"

export const server = 'http://185.227.134.39:4120/'

export const saveimage = async (data: any) => {
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

export const sendtowhatsapp = async (data: any) => {
  console.log('sending to whatsapp')
  const res = await fetch('https://graph.facebook.com/v22.0/495069927028672/messages', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer EAAJyiiK4h10BOwGr3UAIlWogdFFamaj3B4hwTwMaUZCJ2RuVu8D5fBtXeBe7W3jDvcaWh1OwwwSElJxOtr77bd1976X78rVir7VZA5PqISGdrKPeHANrTdY7q72XaRtghxE30XPZCJ70BOgUI9YeJ3XDsaP1etZBbjNIoUmVEI0li4iq8dH7ZAbZAxZCWvdA1MFgDeyhvpHmHzGbMwqJfXpBZANzo1cZD',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: 6289633948126,
      type: data.image? "image":"text",
      text: {
        body: data.text
      },
      image: {
        link: data.image,
        caption: data.caption || "",
      },
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}