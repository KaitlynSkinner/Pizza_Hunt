// import Schema constructor and model function
const { Schema, model } = require('mongoose');

// Data to be stored when users create a new pizza (name of pizza, name of user that created pizza, timestamp of when the pizza was created, timestamp of any updates to pizza's data, pizza's suggested size, and pizza's toppings)
const PizzaSchema = new Schema({
    pizzaName: { 
        type: String 
    },
    createdBy: { 
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
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