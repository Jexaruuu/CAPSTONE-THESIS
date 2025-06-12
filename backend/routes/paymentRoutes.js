const express = require("express");
const router = express.Router();
const axios = require("axios");

// ✅ Environment Variables for API Keys
require("dotenv").config();
const PAYMAYA_API_KEY = process.env.PAYMAYA_API_KEY;
const GCASH_API_KEY = process.env.GCASH_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // For credit card payments

// ✅ Handle Payment Requests
router.post("/", async (req, res) => {
  const { method, amount, customer } = req.body;

  try {
    let checkoutUrl = "";

    if (method === "PayMaya") {
      checkoutUrl = await createPayMayaCheckout(amount, customer);
    } else if (method === "GCash") {
      checkoutUrl = await createGCashCheckout(amount, customer);
    } else if (method === "Credit Card") {
      checkoutUrl = await createStripeCheckout(amount, customer);
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    res.json({ redirectUrl: checkoutUrl });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment processing failed." });
  }
});

// ✅ PayMaya Checkout API
async function createPayMayaCheckout(amount, customer) {
  try {
    const response = await axios.post(
      "https://pg.paymaya.com/checkout/v1/checkouts",
      {
        totalAmount: { amount: amount, currency: "PHP" },
        buyer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          contact: { phone: customer.phone }
        },
        requestReferenceNumber: `paymaya_${Date.now()}`,
        redirectUrl: {
          success: "https://your-site.com/payment-success",
          failure: "https://your-site.com/payment-failed",
          cancel: "https://your-site.com/payment-cancelled"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(PAYMAYA_API_KEY).toString("base64")}`
        }
      }
    );

    return response.data.redirectUrl;
  } catch (error) {
    console.error("Error with PayMaya:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ GCash Checkout API (Using PayMongo)
async function createGCashCheckout(amount, customer) {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            amount: amount * 100, // Convert PHP to centavos
            currency: "PHP",
            payment_method_types: ["gcash"],
            description: "GCash Payment",
            customer_details: {
              name: `${customer.firstName} ${customer.lastName}`,
              phone: customer.phone
            },
            success_url: "https://your-site.com/payment-success",
            failure_url: "https://your-site.com/payment-failed"
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GCASH_API_KEY}`
        }
      }
    );

    return response.data.data.attributes.checkout_url;
  } catch (error) {
    console.error("Error with GCash:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Credit Card Payment via Stripe
async function createStripeCheckout(amount, customer) {
  try {
    const response = await axios.post(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        payment_method_types: ["card"],
        line_items: [{ price_data: { currency: "PHP", product_data: { name: "Purchase" }, unit_amount: amount * 100 }, quantity: 1 }],
        mode: "payment",
        success_url: "https://your-site.com/payment-success",
        cancel_url: "https://your-site.com/payment-cancelled"
      },
      {
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.url;
  } catch (error) {
    console.error("Error with Stripe:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = router;