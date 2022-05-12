// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful 
// With this first event handler, onsuccess, we set it up so that when we finalize the connection to the database, we can store the resulting database object to the global variable db we created earlier. This event will also emit every time we interact with the database, so every time it runs we check to see if the app is connected to the internet network. If so, we'll execute the uploadPizza() function.
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        // uploadPizza();
    }
};

//  onerror event handler to inform us if anything ever goes wrong with the database interaction.
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
// saveRecord() function will be used in the add-pizza.js file's form submission function if the fetch() function's .catch() method is executed.
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // add record to your store with add method
    pizzaObjectStore.add(record);
}

// collect all of the data from the new_pizza object store in IndeedDB and POST it to server
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
  
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();
    
                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                // set reference to redirect here
                console.log(err);
            });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);