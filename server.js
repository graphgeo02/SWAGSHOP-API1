// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://localhost/swag-shop1');

// var Product = require('./model/product');
// var Wishlist = require('./model/wishlist');


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// app.post('/product', function(request, response){
//     var product = new Product();
//     product.title = request.body.title;
//     product.price = request.body.price;

//     try {
//         let savedProduct = await product.save();
//         response.status(200).send(savedProduct);
//     } catch (err) {
//         response.status(500).send({ error: "Could not save product" });
//     }
// });

// app.listen(3000, function(){
//     console.log("Swag Shop API running on port 3000...");
// });

let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let db = mongoose.connect('mongodb://localhost/swag-shop1');

let Product = require('./model/product');
let WishList = require('./model/wishlist');
const wishlist = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let port = 3000;

// Using async/await/regular function to post product 
app.post('/product', async function (request, response) {
    let product = new Product({
        title: request.body.title,
        price: request.body.price,
        // likes: 0
    });

    try {
        let savedProduct = await product.save();
        response.status(200).send(savedProduct);
    } catch (err) {
        response.status(500).send({ error: "Could not save product" });
    }
});

// Using async/await/arrow function to handle fetch product 
app.get('/product', async (request, response) =>{ 
    try {
        // Fetch the products from mongoose
        let products = await Product.find().exec();

        // Send the products to the client
        response.status(200).send(products);
    } catch (err) {
        // Log the error and send a response
        console.error("Error fetching products:", err);
        response.status(500).send({ error: "Could not fetch products" });
    }
});


// Using async/await/regular function to post wish list
 app.post('/wishlist', async function(request, response){
       let wishlist = new WishList();
       wishlist.title = request.body.title;

       try {
        let WishList = await wishlist.save();
        response.status(200).send(WishList);
    } catch (err) {
        response.status(500).send({ error: "Could not save wish list" });
    }
 });     

       
app.get('/wishlist',  async function(request, response){
    try {
        // Fetch the wishlist from mongoose
        let WishLists = await WishList.find().populate('products', '-__v').exec() 
        .catch((err) => {
            console.error('Population Error:', err);
            throw err;
          });

        // Send the wishslist to the client
        response.status(200).send(WishLists);
    } catch (err) {
        // Log the error and send a response
        console.error("Error fetching products:", err);
        response.status(500).send({ error: "Could not fetch wish list" });
    }

});


// app.put('/wishlist/product', async function(request, response){
//     try {
//       let product = await Product.findOne({ _id: request.body.productId });
//       let updatedWishlist = await WishList.findOneAndUpdate(
//         { _id: request.body.wishlistId },
//         { $addToSet: { products: product._id } }

//       );
//       response.status(200).send(updatedWishlist);
//     } catch (err) {
//       response.status(500).send({ error: "Could not add the product to the wishlist" });
//     }
//   });
  

// app.put('/wishlist/product', function(request, response){
//     Product.findOne({_id: request.body.productId}, function(err, product){
//         if(err){
//             response.status(500).send({error:" Could not add item to wish list"});
//         }else{
//             WishList.updateOne({_id: request.body.wishListId}, { $addToSet:{products: product._id}, function(err, wishlist){
//                 if(err){
//                     response.status(500).send({error: "Could not add item to wish list "});
//                 }else{
//                     response.send(WishList)
//                 }
//             }})
//         }
//     })
//     })


app.put('/wishlist/products', async function(request, response) {
    try {
      const { productId, wishlistId } = request.body;
  
      console.log('Request Body:', request.body);
      console.log('Product ID:', productId);
      console.log('Wishlist ID:', wishlistId);
  
      // Find the product by its ID
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return response.status(404).send({ error: 'Product not found' });
      }
  
      console.log('Product:', product);
  
      // Update the wishlist by adding the product ID to the products array
      const updatedWishlist = await WishList.updateOne(
        { _id: wishlistId },
        { $addToSet: { products: product._id } }
      );
  
      console.log('Update Result:', updatedWishlist);
  
      if (updatedWishlist.matchedCount === 0) {
        return response.status(404).send({ error: 'Wishlist not found' });
      }
  
      // Return the updated wishlist is the actual updated document retrieved from the database using findOne.
      const updatedWishlistDoc = await WishList.findOne({ _id: wishlistId });
      response.send(updatedWishlistDoc);
    } catch (err) {
      // Catch any errors and send a 500 response
      response.status(500).send({ error: 'Could not add item to wishlist' });
    }
  });

      



app.listen(port, () => {
    console.log(`Swag Shop API running on port ${port}...`);
});
