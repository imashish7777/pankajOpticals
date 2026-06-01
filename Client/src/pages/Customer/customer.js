import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../../CSS/customer.css";

function Customer() {
  return (
    <div className="container-fluid py-3 client-customer-page">
      <div className="row">
        
        {/* Sidebar */}
        <div className="col-md-3 ms-md-5 mb-4">
          <div
            role="group"
            className="btn-group-vertical w-100 client-customer-nav"
          >
            <Link
              to="/customer"
              className="btn account-toggle text-start"
            >
              Account Information
            </Link>

            <Link
              to="/customer/address"
              className="btn account-toggle text-start"
            >
              Address Book
            </Link>
          </div>
        </div>

        {/* Outlet Content */}
        <div className="col-md-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default React.memo(Customer);
