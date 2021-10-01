import express from "express"
import cors from "cors"
import puppeteer from 'puppeteer-extra';
process.setMaxListeners(Infinity)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {getAllLinks, getPage,getTotalRecords} from "./utils/utils"
puppeteer.use(StealthPlugin())
const app=express()
app.use(cors())
app.use(express.json())
const port=process.env.PORT||3333
app.get("/api",(req,res)=>{
  res.send("Welcome to backend API")
})
app.get("/api/getNoOfRecords",async(req,res)=>{
  const url=req.headers.url
  const site=`site://${url}`
  const {browser,page}=await getPage(req)
  // enter site in google search
  await page.type(".gLFyf.gsfi",site)
  await page.keyboard.press('Enter')
  // wait for page to load
  await page.waitForSelector("#result-stats");
  // await page.screenshot({path: 'screenshot.png'});
  const text=await page.$eval("#result-stats",(e:any)=>e.textContent)
  // get total records
  const value=await getTotalRecords(text)
  res.send({
    message:"success",
    payload:value
  })
})
app.get("/api/getAllUrls",async(req,res)=>{
  const url=req.headers.url
  const site=`site://${url}`
  let allLinks:any;
  const {browser,page}=await getPage(req)
  try{ 
    await page.type(".gLFyf.gsfi",site)
    await page.keyboard.press('Enter')
    // await page.setRequestInterception(true);
    await page.waitForSelector("#rso > div > div > div > div.yuRUbf > a");
    allLinks = await page.$$eval("#rso > div > div > div > div.yuRUbf > a",( am:any) => am.filter((e:any) => e.href).map((e:any )=> e.href))
    const results=await getAllLinks(page,allLinks)
    res.send({
    message:"success",
    payload: results
  })
  await page.close();
  await browser.close();
  }
catch(error){
  console.log(error)
  res.status(404).send("something went wrong")
  await page.close();
  await browser.close();
  // console.log({browserKilled: await wasBrowserKilled(browser)});
}
})
export const server=
  app.listen(port,async()=>{
  console.log(`listening on ${port}/api`)
})
server.on("error",console.error)
