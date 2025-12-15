import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyOrder = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(params.get("status"));
  }, []);

  return (
    <div className="p-6 text-center">
      {status === "success" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-3">
            Payment Successful 🎉
          </h1>
          <p>Your order has been placed!</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-3">
            Payment Failed ❌
          </h1>
          <p>Please try again.</p>
        </>
      )}
    </div>
  );
};

export default VerifyOrder;
