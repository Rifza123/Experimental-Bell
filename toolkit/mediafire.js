const axios = "axios".import()
const cheerio = "cheerio".import()

export const mediafireDl = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = {}
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
let mime;
mime = nama.split('.')
mime = mime[1]
hasil.title = nama 
hasil.size = size
hasil.link = link
return hasil
}

