const http = require("http");
const Room = require("./models/room");
const dotenv = require("dotenv")
const mongoose = require('mongoose');

dotenv.config({path: "./config.env"});

// console.log(process.env);

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)
// 連接資料庫
mongoose.connect(DB)
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
    } else if (req.url=="/rooms" && req.method=="DELETE"){
        await Room.deleteMany({});
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            rooms: []
        }))
        res.end();
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
server.listen(process.env.PORT);