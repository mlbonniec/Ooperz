import {Schema, model} from 'mongoose';

const redactorsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    since: {
        type: Date,
        default: new Date()
    },
    networks: {
        type: [Object],
        default: []
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {versionKey: false});

export default model('Redactors', redactorsSchema);