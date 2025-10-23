import Order from "../backend/models/order.js"
import Product  from "../backend/models/product.js"
import ErrorHandler from "../backend/utils/errorHandler.js"
import catchAsyncErrors from "../backend/middlewares/catchAsyncErrors.js"

// Create a new order   =>  /api/v1/order/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        paymentInfo,

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paymentMethod,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

// Get single order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })

    res.status(200).json({
        success: true,
        orders
    })
})

// Get all orders - ADMIN
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        success: true,
        orders
    })
})

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No Order Found', 404))
    }

    if (order?.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString())

        if (!product) {
            return next(new ErrorHandler('NO Product found with this id', 404))
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false })
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
    })
})

// Delete order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('No Order found with this ID', 404))
    }

    await order.deleteOne()

    res.status(200).json({
        success: true
    })
})

async function getSalesData(startDate, endDate) {

    const salesData = await Order.aggregate([
        {
          $match: {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
          }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                },
                totalSales: { $sum: "$totalPrice" },
                numOrders: { $sum: 1 }
            }
        }
    ])
   const salesMap = new Map()
   let totalSales = 0
   let totalNumOfOrders = 0

   salesData.forEach((entry) => {
    const date = entry?._id.date
    const sales = entry?.totalSales
    const numOrders = entry?.numOrders

    salesMap.set( date, { sales, numOrders } )
    totalSales += sales
    totalNumOfOrders += numOrders
   })
    const datesBetween = getDatesBetween(startDate, endDate)

    const finalSalesData = datesBetween.map((date) => ({
        date,
        sales: (salesMap.get(date) || { sales: 0 }).sales,
        numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    }))
    console.log(finalSalesData)
    return { salesData: finalSalesData, totalSales, totalNumOfOrders}

}

function getDatesBetween(startDate, endDate) {
    const dates = []
    let currentDate = new Date(startDate)
    
    while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0]
        dates.push(formattedDate)
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
}

// Get Sales Data
export const getSales = catchAsyncErrors(async (req, res, next) => {
    
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    startDate.setUTCHours(0, 0, 0, 0)
    endDate.setUTCHours(23, 59, 59, 999)

    const {salesData, totalSales, totalNumOfOrders} = await getSalesData(startDate, endDate)


    res.status(200).json({
        totalSales, 
        totalNumOfOrders,
        sales: salesData, 
    })
})