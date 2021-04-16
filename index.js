const express = require('express') // Adding Express
const app = express() // Initializing Express
const cors = require('cors')
const puppeteer = require('puppeteer') // Adding Puppeteer

// Mvideo title: h1.fl-h1, img: .c-media-container__image, cost: .fl-pdp-price__current


app.get('/Parser', cors(), async(req, res) => {
  let site = req.query.site
  const browser = await puppeteer.launch({
    args: [
    '--ignore-certificate-errors',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-size=1920,1080',
    "--disable-accelerated-2d-canvas",
    "--disable-gpu"],
    ignoreHTTPSErrors: true,
    headless: true,
  })
  let page = await browser.newPage()
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")
  await page.goto(site, {waitUntil: 'domcontentloaded'})

  const data = await page.evaluate(() => {
    return {
      title: document.querySelector('h1.ProductHeader__title').innerText,
      img: document.querySelectorAll('.PreviewList__image')[1].src,
      price: document.querySelector('.ProductPrice__price').firstElementChild.innerText.trim() + ' ' + document.querySelector('.ProductPrice__price').lastElementChild.innerText.trim()
    }
  })
  await page.goto(data.img, {waitUntil: 'domcontentloaded'})
  await page.waitForSelector('img')
  await page.evaluate(() => {
    document.body.style.background = 'transparent'
  })
  
  data.img = data.img.split('/')[data.img.split('/').length-1]
  await page.screenshot({ path: `./images/${data.img}` })
  res.send(data)
  await browser.close()
})

app.get('/images/:users_img', cors(), (req, res) => 
  res.sendFile(__dirname + '/images/' + req.params.users_img )
)

app.listen(process.env.PORT || 7000, () => {
  console.log('Running on port 7000.')
})