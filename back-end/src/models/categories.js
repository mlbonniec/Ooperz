import {Schema, model} from 'mongoose';

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    preview: String
}, {versionKey: false});

export default model('Categories', categoriesSchema);