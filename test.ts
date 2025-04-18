const start = async () => {

  console.log('starting test')

  const res = await fetch('https://graph.facebook.com/v22.0/495069927028672/messages', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer EAAJyiiK4h10BO9NgdZBfN2lEsl1cxKFVJGFDjkMqaDwblPUQ3YkNJtu5ZAW0FmKEY8ay5tEeJDfe3IqxtTsLeU9OFrYc79mu1XnRieoSMTJNrDuLqYxTMsLmfUt7NL0Uvez0quYukEzAZBms0tVFlSiQtwqrASbFT6LZB9SGaDWKDBhoU0W2qmWdWKkp3E9FEgZDZD',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: '6282161440226',
      type: 'text',
      text: {
        body: 'Kiran merasa sedih karna kamu tidak menuruti keinginan nya.'
      }
    })
  })
  const json = await res.json()

  console.log(json)

}

start().then(res => console.log(res))