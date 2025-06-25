const axios = 'axios'.import();
const Form = 'form'.import();
const fs = 'fs'.import();
const { fromBuffer } = (await 'file-type'.import()).default;

export const TelegraPh = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new Form();

      if (Buffer.isBuffer(file)) {
        let { ext } = await fromBuffer(file);
        form.append('file', file, 'tmp.' + ext);
      } else if (typeof file === 'string' && fs.existsSync(file)) {
        form.append('file', fs.createReadStream(file));
      } else {
        return reject(new Error('File not found or invalid input'));
      }

      const { data } = await axios({
        url: 'https://telegra.ph/upload',
        method: 'POST',
        headers: {
          ...form.getHeaders(),
        },
        data: form,
      });

      return resolve('https://telegra.ph' + data[0].src);
    } catch (err) {
      return reject(new Error(String(err)));
    }
  });
};
