const { initializeDatabase } = require( "./db/db.connect" );
const express = require( "express" );
const app = express();
const cors = require( "cors" );
initializeDatabase();

const corsOption = {
    origin: "*",
    credential: true,
    optionSuccessStatus: 200,
};

app.use( express.json() );
app.use( cors( corsOption ) );

// POPULATE DATA
require( "./models/model.relatedItem" );

/* const NewRelProduct = require("./models/model.relatedItem");
const newItem = {
    title:"Men Premium Jocket",
    price:2000,
    imageUrl:"https://images-eu.ssl-images-amazon.com/images/I/619xMvtqClL._AC_UL375_SR375,375_.jpg"
}
const addData = async()=>{
const x = new NewRelProduct(newItem)
await x.save();
}
// addData() */

const NewProduct = require( "./models/model.productList" );

async function addProductToDatabase( newProduct ) {
    try {
        const product = new NewProduct( newProduct );
        const savedProduct = await product.save();
        console.log( "Product Saved!" );
        return savedProduct;
    } catch ( error ) {
        console.error( "Failed to add data", error.message );
        throw error;
    }
}
app.post( "/products/add", async ( req, res ) => {
    try {
        const payload = req.body;
        const { name, title } = payload;
        if ( !name || !title ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Missing required fields: name/title",
            } );
        }
        const detailProduct = await addProductToDatabase( payload );
        if ( detailProduct ) {
            res.status( 201 ).json( detailProduct );
        } else {
            res.status( 404 ).json( { success: false, message: "data not found" } );
        }
    } catch ( error ) {
        console.error( "Server Error", error.message );
        res.status( 500 ).json( {
            success: false,
            message: "Internal server error, failed to add data",
        } );
    }
} );

// 1. Functionality: This API call gets all products from the db.

async function getAllProducts() {
    try {
        const everySingleProduct = await NewProduct.find().populate( "relatedItems" );
        console.log( "get product!" );
        return everySingleProduct;
    } catch ( error ) {
        console.error( "Failed to get all data.", error.message );
        throw error;
    }
}
app.get( "/api/products", async ( req, res ) => {
    try {
        const receivedProduct = await getAllProducts();
        if ( receivedProduct.length != 0 ) {
            res.status( 200 ).json( receivedProduct );
        } else {
            res.status( 404 ).json( { success: false, message: "data not found." } );
        }
    } catch ( error ) {
        console.error( "Internal error,Failed to get data", error.message );
        res.status( 500 ).json( {
            success: false,
            message: "Failed to get all data",
            err: error.message,
        } );
    }
} );

// 2. Functionality: This API call gets product by productId from the db.
async function getProductById( productId ) {
    try {
        const productById = await NewProduct.findOne( { _id: productId } ).populate(
            "relatedItems"
        );
        console.log( "Obtained single data!" );
        return productById;
    } catch ( error ) {
        console.error( "Failed to get data by id", error.message );
        throw error;
    }
}

app.get( "/api/products/:productId", async ( req, res ) => {
    try {
        const receivedSingleProduct = await getProductById( req.params.productId );
        if ( !receivedSingleProduct ) {
            res.status( 404 ).json( { success: false, message: "data not found." } );
        } else {
            res.status( 200 ).json( receivedSingleProduct );
        }
    } catch ( error ) {
        console.error( "Internal sever error:", error.message );
        res.status( 500 ).json( {
            success: false,
            message: "Internal server error,fetching individual data",
        } );
    }
} );

// CATEGORIES
const NewCategory = require( "./models/model.categories" );

async function addCategoryToDb( data ) {
    try {
        const category = new NewCategory( data );
        const savedCategory = await category.save();
        console.log( "Saved Category!" );
        return savedCategory
    } catch ( error ) {
        console.error( "Failed to add data", error.message );
        throw error;
    }
}

app.post( "/products/category", async ( req, res ) => {
    try {
        const receivedAndGet = await addCategoryToDb( req.body );
        if ( receivedAndGet ) {
            res.status( 201 ).json( receivedAndGet )
        } else {
            res.status( 400 ).json( { success: false, message: "data not found." } )
        }
    } catch ( error ) {
        console.error( error.message );
        res.status( 500 ).json( { success: false, message: "Internal error adding data" } )
    }
} )

// 1.Functionality: This API call gets all categories from the db.
async function getAllCategories() {
    try {
        const everySingleCategory = await NewCategory.find();
        console.log( "Achieved category!", everySingleCategory );
        return everySingleCategory;
    } catch ( error ) {
        throw error
    }
}
app.get( "/api/categories", async ( req, res ) => {
    try {
        const reCaptureCategory = await getAllCategories();
        if ( reCaptureCategory.length > 0 ) {
            res.status( 200 ).json( reCaptureCategory )
        } else {
            res.status( 404 ).json( { success: false, message: "Data not found." } )
        }
    } catch ( error ) {
        res.status( 500 ).json( { success: false, message: "Internal error from db" } )
    }
} )

// 2. Functionality: This API call gets category by categoryId from the db.
async function getCategoryById( id ) {
    try {
        const exclusiveCategory = await NewCategory.findOne( { _id: id } )
        console.log( "Redeem Category", exclusiveCategory )
        return exclusiveCategory;
    } catch ( error ) {
        console.error( "Failed to get category!", error.message );
        throw error
    }
}
app.get( "/api/categories/:categoryId", async ( req, res ) => {
    try {
        const categoryStatus = await getCategoryById( req.params.categoryId )
        if ( categoryStatus ) {
            res.status( 200 ).json( categoryStatus )
        } else {
            res.status( 404 ).json( { success: false, message: "data not found." } )
        }
    } catch ( error ) {
        console.error( "Failed to get category by id", error.message )
        res.status( 500 ).json( { success: false, message: "Internal error api/id" } )
    }
} )
app.get( "/", ( req, res ) => {
    res.send( "Hello, Welcome to exress routess." );
} );

const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log( `The server is running on http://localhost:${ PORT }` );
} );
