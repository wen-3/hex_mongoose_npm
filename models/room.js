const mongoose = require("mongoose");
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

module.exports = Room;