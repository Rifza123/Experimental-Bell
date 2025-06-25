async function transcribe(buffer) {
  try {
    let response = await fetch(
      `${api.xterm.url}/api/audioProcessing/transcribe?key=${api.xterm.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      }
    );
    let result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error in transcribe.js :', error);
    return 'gagal!';
  }
}

export { transcribe };
