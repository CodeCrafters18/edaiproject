import {mongoose,Schema} from "mongoose";
const OrderSegregationSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    customer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },address:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    city:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    phoneNumber: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
        required: true
      },
    postCode:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    cart:{
        type:Array,
        required:true,
        trim:true,
        lowercase:true
    },created_At:{
        type:Date,
        default:Date.now
    },
    orderStatus:{
        type:Object,
        required:true,
        trim:true,
        lowercase:true,
        default:"Not Dispatched"
    }
})

export const OrderSegregation = mongoose.model("OrderSegregation",OrderSegregationSchema);