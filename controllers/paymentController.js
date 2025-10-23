import catchAsyncErrors from "../backend/middlewares/catchAsyncErrors.js"
import Stripe from "stripe"
import order from "../backend/models/order.js"
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeCheckoutSession = catchAsyncErrors(async(req, res, next) => {

    const body = req?.body
    const line_items = body?.orderItems?.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item?.name,
                    images: [item?.image],
                    metadata: {productId: item?.product}
                },
                unit_amount: item?.price * 100
            },
            tax_rates: ["txr_1Q8xfJFTVvSVnQrit4t4ZUhh"],
            quantity: item?.quantity
        }
    })

    const shippingInfo = body?.shippingInfo
    const shipping_rate = body?.itemsPrice >= 200 ? "shr_1Q8pEOFTVvSVnQriuNa0P3NN" : "shr_1Q8pFLFTVvSVnQriKJpvR0mi" 

   const session = await stripe.checkout.sessions.create({

    payment_method_types: ["card"],
    success_url: `https://shopholic-1w1s.onrender.com/me/orders`,
    cancel_url: `https://shopholic-1w1s.onrender.com`,
    customer_email: req?.user?.email,
    client_reference_id: req?.user?._id?.toString(),
    mode: "payment",
    metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
    shipping_options: [{
       shipping_rate,
    }],
    line_items,
   })
   console.log(session);
   res.status(200).json({
     url: session.url,
   })
})

const getOrderItems = async(line_items) => {

    return new Promise(( resolve, reject ) => {
        let cartItems = []

        line_items?.data?.forEach(async(item) => {
          const product = await stripe.products.retrieve(item.price.product)
          const productId = product.metadata.productId

          cartItems.push({
            product: productId,
            name: product.name,
            price: item.price.unit_amount_decimal / 100,
            quantity: item.quantity,
            image: product.images[0],
          })
          if( cartItems.length === line_items?.data?.length ) {
             resolve(cartItems)
          } 
        })

    })

}

export const stripWebHook = catchAsyncErrors(async(req, res, next) => {


    try {

        const signature = req.headers["stripe-signature"]
        
       const event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)

       if (event.type === "checkout.session.completed") {

        const session = event.data.object
        const line_items = await stripe.checkout.sessions.listLineItems(session.id)

        const orderItems = await getOrderItems(line_items)
        const user = session.client_reference_id
        const totalPrice = session.amount_total / 100
        const taxPrice = session.total_details.amount_tax / 100
        const shippingPrice = session.total_details.amount_shipping / 100
        const itemPrice = session.metadata.itemsPrice
        const shippingInfo = {
            address: session.metadata.address,
            city: session.metadata.city,
            phoneNo: session.metadata.phoneNo,
            zipCode: session.metadata.zipCode,
            country: session.metadata.country,
        }
        const paymentInfo = {
            id: session.payment_intent,
            status: session.payment_status,
        }
        const orderData = {
            shippingInfo,
            orderItems,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paymentMethod: "Card",
            user,
        }

        await order.create(orderData)

        res.status(200).json({ success: true })

       }

    } catch (error) {
        console.log("Error =>", error);
    }

})