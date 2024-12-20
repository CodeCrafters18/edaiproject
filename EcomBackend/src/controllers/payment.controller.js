import Razorpay from 'razorpay';
import { ApiResponse } from '../utils/ApiResponse.js';
import { billingSchema } from '../models/billingdetails.model.js';
import { OrderSegregation } from '../models/OrderSegregation.model.js';
import crypto from 'crypto';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    const { cart } = req.body;
    const amount = cart.reduce((sum, product) => sum + (product.price[0] * product.qty), 0) * 100; // Convert to paise
    const currency = "INR";
    
    // Ensure req.user exists
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const receipt = `Receipt#${Math.floor(Math.random() * 1000000 + 1)}`;
    const payment_capture = 1;
    
    const options = {
        amount,
        currency,
        receipt,
        payment_capture,
    };
    try {
        const response = await razorpay.orders.create(options);
        response.cart = cart;
        response.user = req.user;
        response.amount = amount;
        return res.json(new ApiResponse(200, response, "Order created successfully"));
    } catch (error) {
        console.error('Razorpay Error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, firstName, lastName, address, city, postCode, phoneNumber, cart ,amount} = req.body;

    try {
        // Generate the expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // Compare the generated signature with the one received from Razorpay
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment verified successfully, now save billing details
            const billing = await billingSchema.create({
                firstName,
                lastName,
                address,
                city,
                postCode,
                cart,
                amount: amount / 100,
                customer: req.user.id,
                phoneNumber,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id
            });
            const segregatedCarts = OrderSegregation22(cart);
            const savedOrders = await saveOrderSegregation(segregatedCarts, {
                orderId: razorpay_order_id,
                customer: req.user.id,
                firstName,
                lastName,
                address,
                city,
                postCode,
                phoneNumber
            });
            return res.json(new ApiResponse(200, { billing }, "Payment verified and billing details saved successfully"));
        } else {
            return res.status(400).json(new ApiResponse(400, null, "Payment verification failed"));
        }
    } catch (error) {
        console.error('Razorpay Error:', error);
        return res.status(500).json(new ApiResponse(500, null, "Server error", error.message));
    }
};
function OrderSegregation22(cart) {
    // Create a map to group products by owner
    const ownerGroups = cart.reduce((groups, product) => {
        // Use owner if exists, otherwise use a default 'unknown' owner
        const ownerId = product.owner || 'unknown';
        
        if (!groups[ownerId]) {
            groups[ownerId] = [];
        }
        groups[ownerId].push(product);
        return groups;
    }, {});

    // Convert the grouped map to an array of owner-specific cart groups
    const segregatedCarts = Object.entries(ownerGroups).map(([ownerId, products]) => ({
        owner: ownerId === 'unknown' ? null : ownerId,
        products: products
    }));

    return segregatedCarts;
}
async function saveOrderSegregation(segregatedCarts, orderDetails) {
    try {
        const savedOrders = [];

        for (const cartGroup of segregatedCarts) {
            const orderData = {
                orderId: orderDetails.orderId,
                owner: cartGroup.owner, // This can be null if no specific owner
                customer: orderDetails.customer,
                firstName: orderDetails.firstName,
                lastName: orderDetails.lastName,
                address: orderDetails.address,
                city: orderDetails.city,
                phoneNumber: orderDetails.phoneNumber,
                postCode: orderDetails.postCode,
                cart: cartGroup.products,
                orderStatus: "Not Dispatched"
            };

            const savedOrder = await OrderSegregation.create(orderData);
            savedOrders.push(savedOrder);
        }
        return savedOrders;
    } catch (error) {
        console.error('Order Segregation Save Error:', error);
        throw error;
    }
}
export { createOrder, verifyPayment };