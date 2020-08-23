import {Schema, model} from 'mongoose';

const apiTokenSchema = new Schema({
    token: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    domains: [Object],
}, {versionKey: false})

export default model('APIToken', apiTokenSchema);