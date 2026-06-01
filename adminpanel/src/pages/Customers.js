import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BLOCK_CUSTOMERS,
  FETCH_CUSTOMERS,
  UNBLOCK_CUSTOMERS,
} from "../redux/features/product/customersSlice";
import { useNavigate } from "react-router-dom";
import {
  Space,
  AutoComplete,
} from "antd";
import "../CSS/Customers.css";

function Customers() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer);
  const navigate = useNavigate();
  const handleSearch = (value) => {
    setValue(value);

    dispatch(FETCH_CUSTOMERS({ search: value }));
  };

  useEffect(() => {
    dispatch(FETCH_CUSTOMERS());
  }, [dispatch]);
  return (
    <div className="container-fluid admin-customers-page">
      <h3>Customers</h3>
      <Space.Compact compact className="admin-search-box">
        <AutoComplete
          className="admin-search-input"
          value={value}
          onChange={handleSearch}
          size="large"
          allowClear={true}
          placeholder="Search Name/Email/Phone"
        ></AutoComplete>
      </Space.Compact>
      <table className="table admin-data-table">
        <thead>
          <tr>
            <th key={0} scope="col">
              #
            </th>
            <th key={1} scope="col">
              Name
            </th>
            <th key={2} scope="col">
              Phone
            </th>
            <th key={3} scope="col">
              Email
            </th>
            <th key={4} scope="col">
              Status
            </th>
            <th key={5} scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {customers?.customers?.length>0 && customers?.customers?.map((i, index) => {
            return (
              <>
                {i.role === "user" && (
                  <tr key={i._id}>
                    <th scope="row">{index}</th>
                    <td
                      onClick={() =>
                        navigate(`/admin/customers/details/${i._id}`)
                      }
                    >
                      {i?.firstname} {i?.lastname}
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/admin/customers/details/${i._id}`)
                      }
                    >
                      {i?.mobileNumber}
                    </td>
                    <td>{i?.email}</td>
                    {i.isblocked ? (
                      <td>&#128308;BLOCKED</td>
                    ) : (
                      <td>&#128994;FINE</td>
                    )}

                    {i.isblocked ? (
                      <td>
                        <button
                          className="btn btn-danger w-100"
                          onClick={() =>
                            dispatch(UNBLOCK_CUSTOMERS({ _id: i._id }))
                          }
                        >
                          Click to Unblock
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          className="btn btn-success w-100"
                          onClick={() =>
                            dispatch(BLOCK_CUSTOMERS({ _id: i._id }))
                          }
                        >
                          Click to Block
                        </button>
                      </td>
                    )}
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
