// import Schema constructor and model function
const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');

// Data to be stored when users create a new pizza (name of pizza, name of user that created pizza, timestamp of when the pizza was created, timestamp of any updates to pizza's data, pizza's suggested size, and pizza's toppings)
const PizzaSchema = new Schema({
    pizzaName: { 
        type: String,
        required: true,
        trim: true
    },
    createdBy: { 
        type: String, 
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        // enum = enumerable - refers to a set of data that can be iterated over - much like using the for...in loop to iterate through an object
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    // set to false as Mongoose returns this virtual itself
    id: false
}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // reduce() method is tallying up the total of every comment with its replies
    // accumulator is total
    // currentVaule is comment
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;


// MOCK DATA - POST DATA
// {
//     "pizzaName": "The Demo Pizza",
//     "createdBy": "Kaitlyn",
//     "size": "Personal",
//     "toppings": [
//         "Green Olives",
//         "Tomato Slices",
//         "Black Olives"
//     ]
// }