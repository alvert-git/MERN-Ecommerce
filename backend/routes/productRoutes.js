const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authmiddleware");


const router = express.Router();

// route POST /api/products
// create a new product
// access private

router.post("/", protect, admin,  async (req, res) => {
    try {
        
    const { name, 
        description,
         price,
          discountPrice,
           countInStock,
            category,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            tags,
            dimensions,
            weight,
            sku, } = req.body;
            const product = new Product({
                name, 
                description,
                 price,
                  discountPrice,
                   countInStock,
                    category,
                    sizes,
                    colors,
                    collections,
                    material,
                    gender,
                    images,
                    tags,
                    dimensions,
                    weight,
                    sku,
                    user: req.user._id,
            });
            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
       
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @rourte PUT /api/products/:id
// update an existing product id
// access private

router.put("/:id", protect, admin, async ( req, res)=> {

    try {
        const { name, 
            description,
             price,
              discountPrice,
               countInStock,
                category,
                sizes,
                colors,
                collections,
                material,
                gender,
                images,
                tags,
                dimensions,
                weight,
                sku, } = req.body;

                // find the product in the databse using id

                const product = await Product.findById(req.params.id);
                if(product){
                    // update the product field

                    product.name = name || product.name;
                    product.description = description  || product.description;
                    product.price = price || product.price;
                    product.discountPrice = discountPrice  || product.discountPrice;
                    product.countInStock =  countInStock || product.countInStock;
                    product.category= category  || product.category;
                    product.sizes = sizes || product.sizes;
                    product.colors =  colors|| product.colors;
                    product.collections =  collections || product.collections;
                    product.material = material || product.material;
                    product.gender = gender  || product.gender;
                    product.images = images || product.images;
                    product.tags =  tags || product.tags;
                    product.dimensions = dimensions  || product.dimensions;
                    product.weight = weight  || product.weight;
                    product.sku = sku  || product.sku;

                    // updated product
                    const updatedProduct = await product.save();
                    res.json(updatedProduct);
                }
                else{
                    res.status(404).json({message: "Product not found"});
                }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// route DELETE /api/product/:id
// delete a product by id
// access private

router.delete("/:id", protect, admin, async (req, res)=>{

    try{
    const product = await Product.findById(req.params.id);
    if(product)
    {
        // remove from the database
        await product.deleteOne();
        res.json({message: "Product removed"});
    }
    else{
        res.status(404).json({message: "Product not found"});
    }
}
catch(error){
    console.error(error);
    res.status(500).send("Server error");
}
})


// route GET /api/products
// get all products
// access public

router.get("/", async (req, res) => {
    try {
        const {collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, limit} = req.query;
        let query = {};
        // filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }
        if(category && category.toLocaleLowerCase() !== "all"){
            query.category = category;
        }

        if(material){
            query.material = {$in: material.split(",")};
        }

        if(size){
            query.sizes = {$in: size.split(",")};
        }
        if(color){
            query.colors = {$in: [color]};
        }
        if(gender){
            query.gender = gender;
        }
        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice){
                query.price.$gte = Number(minPrice);
            }
            if(maxPrice){
                query.price.$lte = Number(maxPrice);
            }
        }
        let sort = {};
        if(sortBy){
           switch(sortBy){
            case "priceAsc":
                sort = {price: 1};
                break;
                case "priceDesc":
                    sort = {price: -1};
                    break;
                    case "popularity":
                        sort = {rating: -1};
                        break;

                        default:
                            break;
           }
        }
        if(search){
            query.$or = 
            [{name: {$regex: search, $options: "i"}}, 
                {description: {$regex: search, $options: "i"}
        }]
    }


//fetch products and apply sortinng and limit
let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
res.json(products);
} 
       
      catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

// @route GET /api/products/best sellers
// get best selling products
// access public

router.get("/best-seller", async (req, res) => {
    try {
      const bestSeller = await Product.findOne().sort({
        rating: -1,
      })

      if(bestSeller){
        res.json(bestSeller);
      }
      else{
        res.status(404).json({message: "No Best Seller found"});
      }
    } catch (error) {
       console.error(error);
       res.status(500).send("Server error");
    }
});



// @routes GET /api/products/new-arrivals
// get new arrivals products
// access public
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({
            createdAt: -1,
        }).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})





// @route GET /api/products/:id
// get a single product by id
// access public
router.get("/:id", async (req, res) => {
    try {
        const  product = await Product.findById(req.params.id);
        if(product){
        res.json(product);
    }
    else{
        res.status(400).json({message: "Product not found"});
    }

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

// route POST /api/products/:id/reviews
// retrieve similiar products based on the current procducts gender

// access private
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(400).json({message: "Product not found"});
        }

        const similarProducts = await Product.find({
            _id: {$ne: id},
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})



module.exports = router;