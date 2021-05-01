const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { invalidInput } = require('./logic');
const mongo_URI = 'mongodb://localhost:27017/phonebookDB';

mongoose.connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true
    }
}).plugin(uniqueValidator);
phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});
const Phone = mongoose.model('Phone', phonebookSchema);

// ************** CREATE *******************
/**
 * Store a given data to the DB. If item exists, return an error.
 * When data is invalid by its content, will return 400.
 |* @param {JSON} data Data to store on the DB.
 * @returns A promise. If succeed, the data stored, else an status code.
 */
const createPhone = async (data) =>{
    try {
        const phone = new Phone(data);
        return await phone.save();
    } catch (e) {
        return e.name === 'ValidationError'? {error: e.message}: 400;
    }
}

// ************** READ *******************

/**
 * Find data in DB by given ID.
 * @param {String} id ID to find in the DB.
 * @returns A promise. If succeed, found data, else, undefined.
 */
const findById = async (id) =>{
    try {
        const result = await Phone.findById(id);
        return result;
    } catch (e) {
        return undefined;
    }
}

/**
 * Search on DB given a query. Retrieves all if filter is not given.
 * @param {JSON} filter Query filter to search on DB, if not given returns all data.
 * @returns A promise of found data
 */
const find = async (filter={}) =>{
    const result = await Phone.find(filter);
    return result;
}

/**
 * Get the actual length of items stored in DB.
 * @returns A promise, size of the DB
 */
const sizeOfCollection = async () =>{
    return  await Phone.countDocuments({});
}

// ************** UPDATE *******************

/**
 * Update item on DB depending on its size.
 * @param {String} id ID of item to be updated.
 * @param {JSON} data Data to be updated.
 * @param {Number} size Quantity of elements to be updated.
 * @returns A promise, if succeed, updated data; else, status code.
 */
const updatePhone = async(id, data, size=2) =>{
    const person = await findById(id);
    if (!person){
        return 404;
    }
    if(invalidInput(data,size)){
        return 400;
    }
    try {
        await Phone.updateOne({_id: id}, data, {runValidators:true});
        return await findById(id);
    } catch (e) {
        return e.name === 'ValidationError'? {error: e.message}: 400;
    }  
};

// ************** DELETE *******************

/**
 * Delete an item on DB given an ID.
 * @param {String} id ID of item to be deleted
 * @returns Promise. Undefined.
 */
const deleteElement = async (id) =>{
    try {
        await Phone.findByIdAndDelete(id);
        return
    } catch (e) {
        return 
    }
}

module.exports = {
    createPhone,
    find,
    findById,
    sizeOfCollection,
    updatePhone,
    deleteElement
};