import { API_BASE_URL } from "../utilies/base_URL";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/customerDetails.css";
import { useEffect } from "react";
import axios from "axios";

function CustomerDetails() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [user, setUser] = useState({});

  const fetchUserData = async (_id) => {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/admin/customers/details`,
      data: { _id },
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    });

    if (response) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    fetchUserData(_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user && (
        <div className="container emp-profile admin-customer-details">
          <form method="post">
            <div className="row">
              <div className="col-12">
                <div className="profile-head">
                  <h5>
                    {user.firstname} {user.lastname}
                  </h5>

                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="home-tab"
                        data-toggle="tab"
                        href="#home"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                      >
                        Profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="tab-content profile-tab" id="myTabContent">
                  <div
                    className="tab-panel fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <div className="row">
                      <div className="col-md-3">
                        <label>User Id</label>
                      </div>
                      <div className="col-md-9">
                        <p>{user._id}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Name</label>
                      </div>
                      <div className="col-md-9">
                        <p>
                          {user.firstname}
                          {user.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Email</label>
                      </div>
                      <div className="col-md-9">
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Phone</label>
                      </div>
                      <div className="col-md-9">
                        <p>{user.mobileNumber}</p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3">
                        <label>Addresses</label>
                      </div>
                      <div className="col-md-9">
                        {user?.addresses?.map((i) => {
                          return (
                            <div className="m-2">
                              {i.firstname} {i.lastname}/{i.phone}
                              <br></br>
                              {i.addresslineOne}, {i.addresslineTwo}, {i.city},{" "}
                              {i.state}
                              {i.zip}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-2">
                    <label>Total orders</label>
                  </div>
                  <div className="col-md-10">
                    <p>{user.order?.length}</p>
                  </div>
                </div>
                <div className="row">
                    <table className="table admin-data-table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">OrderId</th>
                        <th scope="col">Shipping Id</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Order Status</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.order?.map((i) => {
                        return (
                          <>
                            <tr
                              onClick={() =>
                                navigate(
                                  `/admin/customers/orders/details/${i?._id}`
                                )
                              }
                            >
                              <th scope="row"></th>
                              <td>
                                {i?.products?.map((i) => {
                                  return (
                                    <>
                                      {i?.product?.Brand},
                                      {i?.product?.color}/{" "}
                                    </>
                                  );
                                })}
                              </td>
                              <td>{i?._id}</td>
                              <td>{i?.paymentIntet?.id}</td>
                              <td>{i?.orderDate}</td>
                              <td>{i?.orderStatus}</td>

                              <td>{i?.paymentIntet?.method}</td>
                              <td>{i?.paymentIntet?.paymentStatus}</td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default CustomerDetails;
