import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session_id = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/student/verify-payment?session_id=${session_id}`
        );
        alert(response.data.message); // "Payment verified, enrolled successfully!"
        navigate("/studenthome"); // Redirect to the student dashboard
      } catch (error) {
        console.error("Payment verification failed:", error);
        alert("Payment verification failed. Please contact support.");
        navigate("/studenthome");
      }
    };

    if (session_id) {
      verifyPayment();
    }
  }, [session_id, navigate]);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Redirecting you to the dashboard...</p>
    </div>
  );
};

export default PaymentSuccess;
