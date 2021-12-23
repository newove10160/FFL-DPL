const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    notification_receiver:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description:{
        type:String,
        max:500,
    },
    notification_seen:{
        type: Boolean,
        default: false,
        required: true
    },
},
    { timestamps: true }
);
  
  module.exports = mongoose.model("Notification", NotificationSchema);