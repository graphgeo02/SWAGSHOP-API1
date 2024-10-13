var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var wishlist = new Schema({
   title: {type: String, default: "Cool wish list" },
   products: [
    {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }
   ]
   
});

module.exports  = mongoose.model('WishList', wishlist);