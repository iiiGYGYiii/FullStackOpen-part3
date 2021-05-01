const elementExists = (array, field, element) =>{
    return array.filter(el=>el[field]==element[field])[0];
};
const invalidInput = ( input, size ) =>{
    return Object.keys(input).length!==size;
}
const validateRequest = ({
    array,
    field,
    request,
    size=2
}) => {
    return elementExists(array, field, request) ?
    { error: 'field must be unique'}:
    invalidInput(request, size) ?
    { error: 'fields are required (name, number)'}:
    undefined;
}

const updateArrayByField = (array, value, field) => array.map(el => el[field]===value[field] ? value : el);

const deleteElementByField = (array, value, field) => array.filter(el=> el[field]!=value[field]);

module.exports = {
    validateRequest,
    elementExists,
    invalidInput,
    updateArrayByField,
    deleteElementByField
}