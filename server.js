const http = require("http");
const mongoose = require('mongoose');

// 連接資料庫
mongoose.connect('mongodb://127.0.0.1:27017/hotel')
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });

const roomSchema = new mongoose.Schema(
    {
        name: String,
        price: {
            type: Number,
            required: [true, "價格必填欄位"]
        },
        rating: Number,
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false,
    }
)

const Room = mongoose.model('Room', roomSchema)

// const testRoom = new Room(
//     {
//         name: "總統級別單人房",
//         price: 2000,
//         rating: 4.5
//     }
// )

// testRoom.save()
//     .then(() => {
//         console.log("新增資料成功")
//     })
//     .catch(error => {
//         console.log(error)
//     })

Room.create(
    {
        name: "總統級別單人房",
        price: 2000,
        rating: 4.5
    }
).then(() => {
    console.log("新增資料成功")
}).catch(error => {
    console.log(error)
})

const requestListener = (req, res) => {
    console.log(req.url);
    res.end();
}

const server = http.createServer(requestListener);
server.listen(3005);