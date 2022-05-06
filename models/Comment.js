const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;

// MOCK DATA
// {
//     "writtenBy": "Cody",
//     "commentBody": "This pizza sounds great, but best pizza ever seems like a stretch."
// }