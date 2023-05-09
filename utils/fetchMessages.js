const fetcher = async (url, uniqueId) => {
  const res = await fetch(`/api/messages/getMessages?id=${uniqueId}`)
  const data = await res.json()
  const messages = data.messages

  // console.log('FETCHER: ' + JSON.stringify(messages))
  // console.log(uniqueId)
  return messages
}

export default fetcher
