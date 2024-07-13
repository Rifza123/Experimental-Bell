async function musixSearch(buffer) {
  try {
    let response = await fetch(`${api.xterm.url}/api/audioProcessing/whatmusic?key=${api.xterm.key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    })
    let result = await response.json()
    let title =  result.data !== null ? result.data.artists + ", " + result.data.title : "Gatau deh"

    return title
  } catch (error) {
    console.error('Error uploading audio buffer:', error)
    return "gagal!"
  }
}

export { musixSearch }