const http = require("http");
const Room = require("./models/room");
const mongoose = require('mongoose');

// 連接資料庫
mongoose.connect('mongodb://127.0.0.1:27017/hotel')
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });

const requestListener = async (req, res) => {
    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })

    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'
    }

    if(req.url=="/rooms" && req.method=="GET"){
        const rooms = await Room.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status":"success",
            rooms
        }))
        res.end();
    } else if (req.url=="/rooms" && req.method=="POST"){
        req.on('end', async() => {
            try{
                const data = JSON.parse(body);
                const newRoom = await Room.create(
                    {
                        name: data.name,
                        price: data.price,
                        rating: data.rating
                    }
                )
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status":"success",
                    rooms: newRoom
                }))
                res.end();
            } catch (error){
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位填寫錯誤，或沒有此id",
                    "error": error
                }))
                res.end();
            }
        })
    } else if (req.method == "OPTIONS"){
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3005);