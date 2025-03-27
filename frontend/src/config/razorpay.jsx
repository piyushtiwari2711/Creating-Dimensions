import axios from "axios";
import { toast } from "react-hot-toast";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL + "/payment";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Function to initiate payment
export const initiatePayment = async (note, user) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    toast.error("Razorpay SDK failed to load. Check your internet connection.");
    return;
  }

  try {
    // 🔹 Step 1: Create order via backend
    const { data } = await axios.post(`${BASE_URL}/create-order`, {
      amount: note.price, // Amount is already in rupees
      currency: "INR",
      noteId: note.id, // Ensure this matches backend
      userId: user.uid, // Ensure this is correct
    });

    console.log("Order Created:", data);

    const options = {
      key: RAZORPAY_KEY,
      amount: data.amount, // Razorpay expects amount in paise
      currency: data.currency,
      name: "Creating Dimensions",
      description: `Purchase of ${note.title}`,
      order_id: data.id, // Ensure this is correct
      handler: async (response) => {
        // 🔹 Step 2: Verify payment
        try {
          const verifyRes = await axios.post(`${BASE_URL}/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            noteId: note.id, // Ensure this matches backend
            userId: user.uid, // Ensure this matches backend
          });

          if (verifyRes.data.success) {
            toast.success("Payment successful! Note added to your library.");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Error verifying payment.");
        }
      },
      prefill: {
        name: user.displayName,
        email: user.email,
        contact: user.phone || "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (error) {
    console.error("Payment Error: ", error);
    toast.error("Something went wrong. Please try again.");
  }
};
