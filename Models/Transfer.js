import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
     senderAccountName: {
        type: String,
        required: true 
    },
    senderAccountNumber: {
        type: String,
        required: true 
    },
    senderBankName: {
        type: String,
        required: true 
    },
    recipientAccountName: {
        type: String,
        required: true 
    },
    recipientBankName: {
        type: String,
        required: true 
    },
    recipientAccountNumber: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    amount: {
        type: Number,
        required: true 
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Please input the transfer date']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'successful'],
        default: 'pending',
        required: [true, 'Please input the status']
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
   
}, { timestamps: true });  

export const Transfer = mongoose.model('Transfer', TransferSchema);
