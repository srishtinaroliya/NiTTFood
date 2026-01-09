import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import Modal from "../Modal";
import Card from "./Card";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";
import "../App.css";

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  let data = useCart();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg mynavbar ">
        <div className="container-fluid">
          <Link
            className="navbar-brand fs-1 fst-italic"
            style={{ color: "black" }}
            to="/"
          >
            NITFood
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="/navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto ">
              <li className="nav-item">
                <Link
                  className="btn  mx-1"
                  style={{ color: "black" }}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {localStorage.getItem("authToken") ? (
                <li className="nav-item">
                  <Link
                    className="btn  mx-1"
                    style={{ color: "black" }}
                    aria-current="page"
                    to="/myOrder"
                  >
                    My Order
                  </Link>
                </li>
              ) : (
                ""
              )}
              {localStorage.getItem("authToken") ? (
                <li className="nav-item">
                  <Link
                    className="btn  mx-1"
                    style={{ color: "black" }}
                    aria-current="page"
                    to="/addDish"
                  >
                    Add Dish
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
            {!localStorage.getItem("authToken") ? (
              <div className="d-flex">
                <Link
                  className="btn  mx-1"
                  style={{ color: "black" }}
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn  mx-1"
                  style={{ color: "black" }}
                  to="/createuser"
                >
                  SignUp
                </Link>
              </div>
            ) : (
              <div>
                {
                  <div>
                    <div
                      className="btn bg-white text-success mx-2"
                      style={{ color: "black" }}
                      onClick={() => setCartView(true)}
                    >
                      My Cart {"  "}
                      <Badge pill bg="danger">
                        {data.length}
                      </Badge>
                    </div>
                    {cartView ? (
                      <Modal onClose={() => setCartView(false)}>
                        <Cart />
                      </Modal>
                    ) : null}
                    <div
                      className="btn bg-white text-danger mx-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </div>
                }
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
