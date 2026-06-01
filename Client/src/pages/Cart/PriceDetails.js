import React, { useMemo } from "react";
import "../../CSS/cart.css";

function PriceDetails({
  totalPrice = 0,
  totalAfterDiscount,
}) {
  const discountAmount = useMemo(() => {
    if (!totalAfterDiscount) return 0;

    return totalPrice - totalAfterDiscount;
  }, [totalPrice, totalAfterDiscount]);

  const finalAmount = totalAfterDiscount || totalPrice;
  console.log(totalPrice, totalAfterDiscount, discountAmount, finalAmount);

  return (
    <div className="pricedetails p-4 mb-3">
      <div className="container-fluid">
        <div className="row">
          <table>
            <tbody>
              <tr>
                <td>Item total</td>
                <td>₹{totalPrice}</td>
              </tr>

              {Boolean(totalAfterDiscount) && (
                <>
                  <tr>
                    <td>Coupon Discount</td>

                    <td className="text-primary">
                      -₹{discountAmount}
                    </td>
                  </tr>

                  <tr>
                    <td>Net Amount</td>

                    <td>
                      ₹{totalAfterDiscount}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td>Total Payable</td>

                <td>
                  ₹{finalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PriceDetails);
