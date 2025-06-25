async function imageEdit(image, prompt) {
  try {
    if (api.key_gemini) {
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: Buffer.from(image).toString('base64'),
                },
              },
            ],
          },
        ],
        generationConfig: { responseModalities: ['Text', 'Image'] },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${api.key_gemini}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const jsonResponse = await response.json();
      const base64Image = jsonResponse?.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      )?.inlineData?.data;

      if (base64Image) {
        return Buffer.from(base64Image, 'base64');
      }
      throw new Error('Failed to retrieve image');
    } else {
      const res = await fetch(
        `${api.xterm.url}/api/img2img/edit?key=${api.xterm.key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image, prompt }),
        }
      );

      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }

      return Buffer.from(await res.arrayBuffer());
    }
  } catch (e) {
    console.error('Error in imageEdit.js :' + e.message);
    return {};
  }
}
export { imageEdit };
