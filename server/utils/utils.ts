const puppeteer = require('puppeteer-extra');
// get browser and page
export const getPage=async()=>{
    const USER_AGENT='5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    const browser = await puppeteer.launch({headless:false,args: ['--no-sandbox','--disable-setuid-sandbox']});
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
export const getAllLinks=async(page:any,socket:any)=>{
    while(true){
        if(await page.$("#pnnext > span:nth-child(2)")!==null){
          await page.click("#pnnext > span:nth-child(2)")
          await page.waitForSelector("#rso > div > div > div > div.yuRUbf > a")
          const newLinks = await page.$$eval("#rso > div > div > div > div.yuRUbf > a", ( am:any) => am.filter((e:any) => e.href).map((e:any) => e.href))
          socket.emit("url-links",newLinks)
        }
        else{
          break
        }
    }
}
export const getAllUrls=async(url:string,socket:any)=>{
    const site=`site://${url}`
    let allLinks:any;
    const {browser,page}=await getPage()
    try{ 
      await page.type(".gLFyf.gsfi",site)
      await page.keyboard.press('Enter')
      // await page.setRequestInterception(true);
      await page.waitForSelector("#rso > div > div > div > div.yuRUbf > a");
      allLinks = await page.$$eval("#rso > div > div > div > div.yuRUbf > a",( am:any) => am.filter((e:any) => e.href).map((e:any )=> e.href))
      await getAllLinks(page,socket)
      socket.emit("url-links",allLinks)
    }
  catch(error){
    console.log(error)
    // console.log({browserKilled: await wasBrowserKilled(browser)});
  }
  finally{
    socket.disconnect()
    await page.close();
    await browser.close();
    
  }}