async function ai(body){
   let res = await fetch(`${api.xterm.url}/api/chat/logic-bell?key=${api.xterm.key}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
   return await res.json()
}

export { ai }