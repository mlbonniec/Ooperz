import {Schema, model} from 'mongoose';
import {nanoid} from 'nanoid';

const newsletterSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: true,
        default: () => nanoid()
    }
}, {versionKey: false});

export default model('Newsletters', newsletterSchema);