const axios = "axios".import()
const Form = "form".import()
const { fromBuffer } = (await 'file-type'.import()).default

export const tmpFiles = async (buffer) => {
  try {
    const { ext, mime } = await fromBuffer(buffer)
    const form = new Form();
    form.append('file', buffer, {
      filename: new Date() * 1 + '.' + ext,   
      contentType: mime
    })
    
    const response = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    return response.data.data.url.replace("s.org/","s.org/dl/")
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};