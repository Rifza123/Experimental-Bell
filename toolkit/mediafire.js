const cheerio = 'cheerio'.import();

export const mediafireDl = async (url) => {
  try {
    const res = await fetch(url, {
      headers: { 'upgrade-insecure-requests': '1' },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const dlButton = $('#downloadButton');
    if (!dlButton.length) throw new Error('Download button not found.');

    const scrambledUrl = dlButton.attr('data-scrambled-url');
    if (!scrambledUrl) throw new Error('Scrambled download URL not found.');

    const decodedUrl = Buffer.from(scrambledUrl, 'base64').toString('utf-8');

    const fileName =
      $('.dl-btn-label').attr('title') ||
      $('.promoDownloadName .dl-btn-label').attr('title');
    const sizeText = dlButton.text().trim();
    const size = sizeText.match(/\((.*?)\)/)?.[1] || 'Unknown size';

    const mime = fileName ? fileName.split('.').pop() : 'unknown';

    return {
      title: fileName || 'Unknown file',
      size: size,
      link: decodedUrl,
      mime: mime,
    };
  } catch (error) {
    console.error('Error in mediafireDl:', error.message);
    return null;
  }
};
