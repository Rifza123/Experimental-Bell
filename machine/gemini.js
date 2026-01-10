async function GeminiImage(image, query) {
  try {
    const response = await fetch(
      `${api.xterm.url}/api/img2txt/gemini-image?key=${api.xterm.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, query }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    !data.response && console.log({ data });
    return data.response;
  } catch (e) {
    console.error('Error in gemini.js :' + e.message);
    return {};
  }
}
export { GeminiImage };
