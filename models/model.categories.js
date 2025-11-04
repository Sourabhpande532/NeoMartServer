const mongoose = require( "mongoose" );

const categorySchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    featuredBanner: {
        imageUrl: String,
        title: String,
        subtitle: String
    },
    newArrivals: [
        {
            title: String,
            subtitle: String,
            imageUrl: String
        }
    ]
}, { timestamps: true } )

module.exports = mongoose.model( "ECategory", categorySchema )