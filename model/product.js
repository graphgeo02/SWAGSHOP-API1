var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    // likes: { Type: Number, default : 0}
   
});

module.exports  = mongoose.model('Product', product);








// let mongoose = require('mongoose');
// let Schema = mongoose.Schema;

// let product = new Schema(
//     {
//         title: String,
//         price: Number,
//         likes: {type: Number, default: 0} // Ensure this is valid
//     }
// );

// module.exports = mongoose.model('Product', product);
