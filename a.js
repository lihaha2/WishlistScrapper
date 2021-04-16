const fetch = require("node-fetch")

const Handle = async()=>{
    res = await fetch('http://localhost:7000/Parser?site=https://www.mvideo.ru/products/sistemnyi-blok-igrovoi-lenovo-ideacentre-g5-14imb05-90n90096rs-30055075')
    console.log(res)
    
}

Handle()