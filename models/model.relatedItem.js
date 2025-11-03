const mongoose = require( "mongoose" );
const RelatedProduct = new mongoose.Schema( {
    title: String,
    price: Number,
    imageUrl: String
} )
const RelatedProductDetails = mongoose.model( "RelatedProduct", RelatedProduct );
module.exports = RelatedProductDetails;