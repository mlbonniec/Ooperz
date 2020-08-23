import {Schema, model} from 'mongoose';

const articlesSchema = new Schema({
    title: String,
    preview: String,
    content: String,
    cover: String,
    slug: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    redactor: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    public: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    pinned: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    }
}, {versionKey: false});

export default model('Articles', articlesSchema);