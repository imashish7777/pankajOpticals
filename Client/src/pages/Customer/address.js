import React, {
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import "../../CSS/customer.css";

import Addressbox from "./addressbox";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchaddress,
} from "../../redux/features/product/addressSlice";

function Address() {
  const dispatch = useDispatch();

  const [newAddresses, setNewAddresses] = useState([]);

  const { addresses = [] } = useSelector(
    (state) => state.address
  );

  useEffect(() => {
    dispatch(fetchaddress());
  }, [dispatch]);

  const handleNewAddress = useCallback(() => {
    setNewAddresses((prev) => [...prev, Date.now()]);
  }, []);

  return (
    <div className="address-page">
      {/* New Address Forms */}

      {newAddresses.map((id) => (
        <Addressbox
          key={id}
          edit="true"
          save="true"
          show="true"
        />
      ))}

      <div className="address-title">
        SAVED ADDRESSES
      </div>

      {/* Saved Addresses */}

      {addresses.length > 0 &&
        addresses.map((i) => (
          <Addressbox
            key={i._id}
            edit="false"
            update="true"
            show="true"
            _id={i._id}
            firstname={i.firstname}
            lastname={i.lastname}
            
            phone={i.phone}
            addresslineOne={i.addresslineOne}
            addresslineTwo={i.addresslineTwo}
            city={i.city}
            state={i.state}
            zip={i.zip}
          />
        ))}

      {/* Add Address Button */}

      <button
        type="button"
        className="btn address-add-btn"
        onClick={handleNewAddress}
      >
        + Add address
      </button>
    </div>
  );
}

export default memo(Address);
