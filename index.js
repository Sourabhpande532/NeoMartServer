const { initializeDatabase } = require( "./db/db.connect" );
const express = require( "express" );
const app = express();
const cors = require( "cors" );
initializeDatabase();

const corsOption = {
    origin: "*",
    credential: true,
    optionSuccessStatus: 200
}

app.use( express.json() );
app.use( cors( corsOption ) )

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
        throw error
    }
}

app.post( "/products/add", async ( req, res ) => {
    try {
        const payload = req.body;
        const { name, title } = payload;
        if ( !name || !title ) {
            return res.status( 400 ).json( { success: false, message: "Missing required fields: name/title" } )
        }
        const detailProduct = await addProductToDatabase( payload );
        if ( detailProduct ) {
            res.status( 201 ).json( detailProduct );
        } else {
            res.status( 404 ).json( { success: false, message: "data not found" } )
        }
    } catch ( error ) {
        console.error( "Server Error", error.message );
        res.status( 500 ).json( { success: false, message: "Internal server error, failed to add data" } )
    }
} )
app.get( "/", ( req, res ) => {
    res.send( "Hello, Welcome to exress routess." )
} )

const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log( `The server is running on http://localhost:${ PORT }` );

} )