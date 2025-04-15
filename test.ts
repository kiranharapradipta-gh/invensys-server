const sendtowhatsapp = async (data: any) => {
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
      type: "image",
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

sendtowhatsapp({
  image: 'http://192.168.1.227:4120/1744100178271.jpg',
  caption: 'hello world'
})