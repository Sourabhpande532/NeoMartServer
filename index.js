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
        const { name, title, price, category } = payload;
        if ( !name || !title || !price || !category ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Missing required fields: name/title/price/category",
            } );
        }
        // validate category exists
        /* const cat = await Category.findById(category);
           if (!cat) return res.status(400).json({ error: 'Invalid category id' });
        */
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
        const products = await NewProduct.find().populate( "relatedItems" ).populate( "category" );
        console.log( "get product!" );
        return products;
    } catch ( error ) {
        console.error( "Failed to get all data.", error.message );
        throw error;
    }
}
app.get( "/api/products", async ( req, res ) => {
    try {
        const products = await getAllProducts();
        if ( products.length != 0 ) {
            res.status( 200 ).json( { data: { products } } );
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
        const product = await NewProduct.findById( productId ).populate(
            "relatedItems"
        ).populate( "category" );
        console.log( "Obtained single data!" );
        return product;
    } catch ( error ) {
        console.error( "Failed to get data by id", error.message );
        throw error;
    }
}

app.get( "/api/products/:productId", async ( req, res ) => {
    try {
        const product = await getProductById( req.params.productId );
        if ( !product ) {
            res.status( 404 ).json( { success: false, message: "product not found." } );
        } else {
            res.status( 200 ).json( { data: { product } } );
        }
    } catch ( error ) {
        console.error( "Internal sever error:", error.message );
        res.status( 500 ).json( {
            success: false,
            message: "Internal server error,fetching individual product",
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

// ADD CATEGORIES TO DB 
app.post( "/products/category", async ( req, res ) => {
    try {
        const payload = req.body;
        const { name, thumbnailUrl, slug } = payload;
        if ( !name || !thumbnailUrl || !slug ) {
            return res.status( 400 ).json( { error: "missing fields required: /name/thumbnailUrl,slug" } )
        }
        const receivedAndGet = await addCategoryToDb( payload );
        if ( receivedAndGet ) {
            res.status( 201 ).json( { data: { receivedAndGet } } )
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
        const everySingleCategory = await NewCategory.find().sort( { name: 1 } ); // { name: 1 } → sorts in ascending order (A → Z).
        console.log( "Achieved category!" );
        return everySingleCategory;
    } catch ( error ) {
        throw error
    }
}

/** 
 * 
 * 
 * 
GET /api/categories
Request URL: /api/categories
HTTP Method: GET
Response Body:
{
  data: {
    categories: Array;
  }
}
*/

app.get( "/api/categories", async ( req, res ) => {
    try {
        const categories = await getAllCategories();
        if ( categories.length > 0 ) {
            res.status( 200 ).json( { data: { categories } } )
        } else {
            res.status( 404 ).json( { success: false, message: "Data not found." } )
        }
    } catch ( error ) {
        res.status( 500 ).json( { success: false, message: "Internal error from db" } )
    }
} )


// 2. Functionality: This API call gets category by categoryId from the db.
/**
 * GET /api/categories/:categoryId
 * returns category + products in that category
 * { data: { category: { ... , products: [...] } } }
 */

async function getCategoryById( id ) {
    try {
        const category = await NewCategory.findById( id ); // return object 
        const products = await NewProduct.find( { category: id } ).populate( "category" ) // return selected array those match with id
        console.log( "Redeem Category!" )
        return { category, products };
    } catch ( error ) {
        console.error( "Failed to get category!", error.message );
        throw error
    }
}

/**
 * 
 * 
 * GET /api/categories/:categoryId
Request URL: /api/categories/:categoryId
HTTP Method: GET
Response Body:
{
  data: {
    category: Object;
  }
}
 *  */
app.get( "/api/categories/:categoryId", async ( req, res ) => {
    try {
        const { categoryId } = req.params;
        const { category, products } = await getCategoryById( categoryId )
        if ( !category ) return res.status( 404 ).json( { error: "Category not found" } )
        res.json( { data: { category: { ...category.toObject(), products } } } )
    } catch ( error ) {
        console.error( "Failed to get category by id", error.message )
        res.status( 500 ).json( { success: false, message: "Internal error api/id" } )
    }
} )

/* NOTES: 
Step Purpose
category-Mongoose document (not plain object)
.toObject()-Converts to normal JS object
{ ...category.toObject(), products }-Merges the category fields + its related products
res.json()-Sends clean, serializable JSON to the client
category.toObject() converts the Mongoose document into a plain JavaScript object — stripping away all Mongoose-specific properties and methods.because: This returns a Mongoose Document, not a plain JavaScript object.const category = await Category.findById(categoryId);
result: {
  "data": {
    "category": {
      "_id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "thumbnailUrl": "...",
      "products": [ ... ]
    }
  }
}

*/

app.get( "/", ( req, res ) => {
    res.send( "Hello, Welcome to exress routess." );
} );

const PORT = process.env.PORT || 4000;
app.listen( PORT, () => {
    console.log( `The server is running on http://localhost:${ PORT }` );
} );
