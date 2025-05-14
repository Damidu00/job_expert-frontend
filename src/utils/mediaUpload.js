import { createClient } from "@supabase/supabase-js"

const key =  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eWN3cHRwdXB6dmp3b2ZkZWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMjM4OTksImV4cCI6MjA1MTc5OTg5OX0.IoV8pQdDBJyyD-pLGvO0ua2nJOkj8KZty3cTvHwmHRc`

const url = "https://lyycwptpupzvjwofdegk.supabase.co"

export default function fileUploadForSupaBase(file){
    return new Promise((resolve,reject)=>{
        if(file == null){
            reject("File not added")
        }

        let fileName = file.name
        const extention = fileName.split(".")[fileName.split(".").length-1]

        const supabase = createClient(url,key)

        const timeStamp = new Date().getTime()

        fileName = "Job" + timeStamp + fileName +"." + extention

        supabase.storage.from("images").upload(fileName,file,{
            cacheControl : "3600",
            upsert : false
        }).then(()=>{
            const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl
            resolve(publicUrl)
        }).catch((err)=>{
            reject(err)
        })
    })
    
}



// if(extention !="jpg" && extention !="png"){
//     alert("Please select a jpg or png file")
//     return
// }

