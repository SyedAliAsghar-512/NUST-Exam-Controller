import Product from "../backend/models/product.js"
import Order from "../backend/models/order.js"
import APIFilters from "../backend/utils/apiFilters.js";
import errorHandler from "../backend/utils/errorHandler.js";
import catchAsyncErrors from "../backend/middlewares/catchAsyncErrors.js";
import {upload_file, delete_file} from "../backend/utils/cloudinary.js"

export const getProducts = catchAsyncErrors(async (req, res, next) => {
    const apiFilters = new APIFilters (Product, req.query).search().filters();
    const resPerPage = 4;
    

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();



    res.status(200).json({
    products,
    resPerPage,
    filteredProductsCount

    });
});

export const newProducts = catchAsyncErrors(async(req, res) => {
    req.body.user = req.user._id
    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    });
});

export const check = catchAsyncErrors(async(req, res) => {
    
    const products = 
        {
            "title": "Welcome Page",
            "content": "<h1>Welcome to our website!</h1><p>This is a paragraph with <strong>bold text</strong>.</p>"
        }
        
        

    res.status(200).json({
       products,
    });

});

export const getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req?.params?.id).populate("reviews.user");

    if (!product) {
     return next(new errorHandler("Product not found",404));
    };

    res.status(200).json({
        product,
    });
});

export const getAdminProducts = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.find()

    res.status(200).json({
        product,
    });
});

export const updateProduct = catchAsyncErrors(async(req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
     return res.status(404).json({
       error: "Product not found"
     });
    };

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true} );

    res.status(200).json({
        product,
    });
});

export const uploadProductImages = catchAsyncErrors(async(req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
     return res.status(404).json({
       error: "Product not found"
     });
    };

    const uploader = async (image) => upload_file(image, "shopholic/products")

    const urls = await Promise.all((req?.body?.images).map(uploader))
    product?.images?.push(...urls)
    await product?.save()

    res.status(200).json({
        product,
    });
});

export const deleteProductImage = catchAsyncErrors(async(req, res) => {


    let product = await Product.findById(req?.params?.id);

    if (!product) {
     return res.status(404).json({
       error: "Product not found"
     });
    };

    const isDeleted = await delete_file(req.body.imgId)

    if(isDeleted) {
        product.images = product?.images?.filter(
            (img) => img.public_id !== req.body.imgId
        )
        await product?.save()
    }

    res.status(200).json({
        product,
    });
});

export const deleteProduct = catchAsyncErrors(async(req, res) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
     return res.status(404).json({
       error: "Product not found"
     });
    };

    await product.deleteOne();

    res.status(200).json({
        message: "Product Deleted",
    });
});

// Create new review\
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// Get Product Reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user");

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Product Review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    const reviews = product?.reviews?.filter(review => review._id.toString() !== req?.user?._id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

export const canUserReview = catchAsyncErrors(async(req, res) => {
   const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
   })

     if (orders.length === 0) {
        return res.status(200).json({canReview: false})
     }

    res.status(200).json({
        canReview: true,
    });
});