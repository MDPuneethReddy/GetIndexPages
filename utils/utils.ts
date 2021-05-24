const puppeteer = require('puppeteer-extra');

// get no of total pages
export const getTotalRecords=(text:string)=>{
    const temp=text.split(" ")
    let value:string
    temp[0]==="About"? value=temp[1]: value=temp[0]
    return value
}
// get browser and page
export const getPage=async(req:any)=>{
    const USER_AGENT='5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    const browser = await puppeteer.launch({headless:true,args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });
    await page.goto('https://www.google.com/',{waitUntil: 'networkidle0'});
    // enter site in google search
    return {browser,page}
}
// check the browser is killed or not
export const wasBrowserKilled=async(browser:any)=>{
    const procInfo = await browser.process();
    return !!procInfo.signalCode;
}
export const getAllLinks=async(page:any,allLinks:any)=>{
    while(true){
        if(await page.$("#pnnext > span:nth-child(2)")!==null){
          await page.click("#pnnext > span:nth-child(2)")
          await page.waitForSelector("#rso > div > div > div > div.yuRUbf > a")
          const newLinks = await page.$$eval("#rso > div > div > div > div.yuRUbf > a", ( am:any) => am.filter((e:any) => e.href).map((e:any) => e.href))
          allLinks=allLinks.concat(newLinks)
        }
        else{
          break
        }
    }
    return allLinks
}