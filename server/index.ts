import express from "express"
import cors from "cors"
import puppeteer from 'puppeteer-extra';
process.setMaxListeners(Infinity)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {getAllUrls} from "./utils/utils"
import {Server} from "socket.io"
puppeteer.use(StealthPlugin())
const app=express()
app.use(cors())
app.use(express.json())
const port=process.env.PORT||3333
app.get("/api",(req,res)=>{
  res.send("Welcome to backend API")
})
export const server=
  app.listen(port,async()=>{
  console.log(`listening on ${port}/api`)
})
server.on("error",console.error)
const io = new Server(server);
io.on('connection', socket => {
  console.log('Some client connected')
  socket.on("indexpages-url",(url:string)=>{
    getAllUrls(url,socket)
  })
})

