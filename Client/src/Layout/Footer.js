import { API_BASE_URL } from "../utilies/base_URL";
import React, { lazy } from "react";
import "../CSS/footer.css";

import { Link } from "react-router-dom";

import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";

import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as yup from "yup";
import { message } from "antd";

const Contact = lazy(() => import("../modals/Contact"));

function Footer() {
  const initialValues = {
    email: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid Email")
      .required("Email is required"),
  });

  const handleOnSubmit = async (values, onSubmitProps) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/subscribe`,
        values
      );

      if (response.status === 200) {
        message.success("Thank you for subscription");
        onSubmitProps.resetForm();
      }
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      {/* ================= NEWSLETTER ================= */}
      <footer>
        <div className="container-xxl newsletter">
          <h2>Sign Up for Newsletter</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {() => (
              <Form className="input-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                />

                <button type="submit" className="input-group-text">
                  Subscribe
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </footer>

      {/* ================= ABOUT ================= */}
      <footer>
        <div className="container-xxl">
          <h1>Buy The Best Eyewear From Pankaj Opticals</h1>

          <p className="company-details">
            Pankaj Opticals caters to every customer with several deals and offers.
            A one-stop online solution for eyewear and accessories.

            <Link to="/products/Sunglasses"> Sunglasses </Link>
            and
            <Link to="/products/Eyeglasses"> Eyeglasses </Link>
            are available for men and women.
          </p>
        </div>
      </footer>

      {/* ================= FOOTER LINKS ================= */}
      <footer>
        <div className="container-xxl footer-grid">

          {/* CONTACT */}
          <div>
            <h4>Contact Us</h4>

            <address>
              Near GGIC, <br />
              Charkhari, Uttar Pradesh <br />
              Pincode: 210421
            </address>

            <a href="tel:+917393078873">
              +91 7393078873
            </a>
            <br />
            <a href="mailto:ashishchandra094@gmail.com">
              ashishchandra094@gmail.com
            </a>

            <div className="social-icons">
              <a
                href="https://www.facebook.com/profile.php?id=100010171928484"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>

              <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                <FaTwitterSquare />
              </a>

              <a
                href="https://www.instagram.com/i_m_ashish777_/"
                target="_blank"
                rel="noreferrer"
              >
                <FaSquareInstagram />
              </a>
            </div>
          </div>

          {/* INFORMATION */}
          <div>
            <h4>Information</h4>

            <div className="footer-links">
              <Link>Privacy Policy</Link>
              <Link>Refund Policy</Link>
              <Link>Shipping Policy</Link>
              <Link>Terms & Conditions</Link>
            </div>
          </div>

          {/* ACCOUNT */}
          <div>
            <h4>Account</h4>

            <div className="footer-links">
              <Link>About</Link>
              <Link>FAQ</Link>

              <Link
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Contact Us
              </Link>

              <Contact />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4>Quick Links</h4>

            <div className="footer-links">
              <Link to="/products/Eyeglasses">
                Eyeglasses
              </Link>

              <Link to="/products/Sunglasses">
                Sunglasses
              </Link>

              <Link to="/products/Menssunglasses">
                Men's Sunglasses
              </Link>

              <Link to="/products/Womenssunglasses">
                Women's Sunglasses
              </Link>

              <Link>Eyewear Accessories</Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= COPYRIGHT ================= */}
      <footer>
        <div className="container-xxl footer-bottom">
          <p>Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
          <p>Created by Ashish Chandra</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
