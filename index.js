const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req,res) => {
  if(req.url === '/favicon.ico'){
    return
  }
  let pathname = path.join(__dirname, url.parse(req.url).pathname)
  pathname = decodeURIComponent(pathname) // url解码，防止中文路径出错
  console.log('11111',url.parse(req.url).pathname)
  console.log('22222',pathname)
  if(fs.statSync(pathname).isDirectory()){
          // 设置响应头
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
          fs.readdir(pathname, (err, files)=>{
              res.write('<ul>')
              files.forEach((item)=>{
                    // 处理路径
                  console.log('3333',item)
                  let link = path.join(url.parse(req.url).pathname, item)
                  res.write(`<li><a href="${link}">${item}</a></li>`)
              })
              res.end('</ul>')
          })
      } else {
        // 以binary读取文件
          fs.readFile(pathname, 'binary', (err, data)=>{
            if(err){
              res.writeHead(500, { 'Content-Type': 'text/plain'})
              res.end(JSON.stringify(err))
              return false
            }
            res.writeHead(200, {
              'Content-Type': `${mime.lookup(pathname)};charset:UTF-8`
            })
            res.write(data, 'binary')
            res.end()
          })
      }

}).listen(port,hostname,()=>{
  console.log(`服务器运行在 http://${hostname}:${port}`)
})
