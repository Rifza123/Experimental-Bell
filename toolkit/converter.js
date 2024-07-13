const a = await "axios".import()
const f = await "form".import()
const fs = await "fs".import()

   async function AacToMp3(file){   
      let data = new f()
         data.append('fileType', 0)
         data.append('file', file, { filename: 'Clara-' + Math.random() + '.aac', type: 'audio/aac' })
         data.append('convertOption', `{"audioFormat":"mp3"}`)
         
      let headers = {
        'content-type': 'multipart/form-data',
        'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
      
      let id = await ( await a.request({ method: "POST", url: "https://api.products.aspose.app/audio/conversion/api/conversion", data:data, headers:headers }) ).data.Data.FileRequestId
      console.log(id)
       let act = 0
         while(act < 50){
            await new Promise(resolve => setTimeout(resolve, 3000));
              let s = await ( await a.get("https://api.products.aspose.app/audio/conversion/api/conversion/HandleStatus?fileRequestId="+id) ).data.Data

               if(s.Status == 0){
                 return s.DownloadLink 
               }
         }                 
   }
   
   export { AacToMp3 }
   