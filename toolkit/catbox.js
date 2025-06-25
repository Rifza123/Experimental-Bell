const axios = 'axios'.import();
const Form = 'form'.import();
const { fromBuffer } = (await 'file-type'.import()).default;

export const catbox = async (buffer) => {
  try {
    const { ext } = await fromBuffer(buffer);
    const fd = new Form();
    fd.append('fileToUpload', buffer, new Date() * 1 + '.' + ext);
    fd.append('reqtype', 'fileupload');

    const { data } = await axios.post('https://catbox.moe/user/api.php', fd, {
      headers: fd.getHeaders(),
    });
    return data?.trim() || 'failed';
  } catch (e) {
    throw new Error(`Upload error: ${e.message}`);
  }
};
