const axios = "axios".import()
const Form = "form".import()
const { fromBuffer } = (await 'file-type'.import()).default
const key = "AIzaBj7z2z3xBjsk"

export const TermaiCdn = async(buffer) => {
  const { ext } = await fromBuffer(buffer)
  const formData = new Form();
  formData.append('file', buffer, { filename: 'file.'+ext });

  try {
    const { data } = await axios.post(`https://cdn.xtermai.xyz/api/upload?key=${key}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.path
  } catch (error) {
    console.error('Error uploading file', error.response?.data || error.message);
    throw new Error(error)
  }
}