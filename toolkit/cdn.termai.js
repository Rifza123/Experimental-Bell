const axios = 'axios'.import();
const Form = 'form'.import();
const { fromBuffer } = (await 'file-type'.import()).default;
const key = 'AIzaBj7z2z3xBjsk';

export const TermaiCdn = async (buffer) => {
  const fileType = await fromBuffer(buffer);
  const ext = fileType?.ext || 'bin';

  const formData = new Form();
  formData.append('file', buffer, { filename: 'file.' + ext });

  try {
    const { data } = await axios.post(
      `https://c.termai.cc/api/upload?key=${key}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.path;
  } catch (error) {
    console.error(
      'Error uploading file',
      error.response?.data || error.message
    );
    throw new Error(error);
  }
};
