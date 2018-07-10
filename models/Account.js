const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        uuid: 
        {
            unique: true,
            type: String,
            required: [true, '`{PATH}` is required.'],
            maxlength: [150, '`The maximum length of {PATH}` field  must be less then {MAXLENGTH} characters'],
            minlength: [4, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
        },
        username:
        {
            unique: true,
            type: String,
            required: [true, '`{PATH}` is required.'],
            maxlength: [150, '`The maximum length of {PATH}` field  must be less then {MAXLENGTH} characters'],
            minlength: [4, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
        },
        name:
        {
            type: String,
            default: null
        },
        surname:
        {
            type: String,
            default: null
        },
        email:
        {
            index: { unique: true },
            type: String,
            required: [false, '`{PATH}` is required.'],
        },
        password:
        {
            type: String,
            required: [false, '`{PATH}` is required.'],
        },
        phoneNumber:
        {
            type: String,
            default: null
        },
        alertEmail:
        {
            type: Boolean,
            default: true
        },
        alertNotification:
        {
            type: Boolean,
            default: false
        },
        alertSms:
        {
            type: Boolean,
            default: false
        },
        lastLogin:
        {
            type: Date,
            default: null
        },
        createdAt:
        {
            type: Date,
            default: Date.now
        },
        active:
        {
            type: Boolean,
            default: true
        }
    }
);

module.exports = mongoose.model('account', AccountSchema);