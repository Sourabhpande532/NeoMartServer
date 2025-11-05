const mongoose = require( "mongoose" );
const ProductListingsSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        current: { type: Number, required: true, default: 0 },
        original: { type: Number },
        discountPercent: { type: Number }
    },
    rating: {
        stars: { type: Number, default: 0 },
        reviewsCount: { type: Number }
    },
    sizes: [String], //e.g ["S","M","XXL"]
    colors: [String],
    selectedColors: { type: String, default: "Black" },
    deliveryInfo: {
        freeDelivery: { type: Boolean, default: false },
        payOnDelivery: { type: Boolean, default: false },
        returnDays: { type: Number },
        authenticity: { type: Boolean, default: true },
    },
    imgUrl: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "ECategory", required: true },
    description: {
        quality: String,
        design: String,
        comfort: String,
        sizing: String,
        returnPolicy: String,
    },
    relatedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "RelatedProduct" }],
}, { timestamps: true } )
const ProductListing = mongoose.model( "EProductListing", ProductListingsSchema );
module.exports = ProductListing;