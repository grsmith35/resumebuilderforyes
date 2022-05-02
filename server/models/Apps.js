const { Schema, model } = require('mongoose');

const appSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            match: [/.+@.+\..+/, 'Must match an email address!']
        },
        date: {
            type: String
        },
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

const Apps = model('Apps', appSchema);

module.exports = Apps