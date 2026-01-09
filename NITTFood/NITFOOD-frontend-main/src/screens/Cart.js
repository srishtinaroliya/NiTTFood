import React, { useRef } from "react";
//import Delete from '@material-ui/icons/Delete'
//import trash from "../trash.svg"
import { useCart, useDispatchCart } from "../components/ContextReducer";
import "../App.css";

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const deliveryAddressRef = useRef(null);

  if (data.length === 0) {
    return (
      <div>
        <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
      </div>
    );
  }
  // const handleRemove = (index)=>{
  //   console.log(index)
  //   dispatch({type:"REMOVE",index:index})
  // }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response;
    //console.log(data, localStorage.getItem("userEmail"), new Date());
    for (let i = 0; i < data.length; i++) {
      const { email, ...temp } = data[i];
      temp.userEmail = userEmail;
      response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: [temp],
          email: email,
          order_date: new Date().toDateString(),
        }),
      });
    }

    let res = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data[0].price,
      }),
    });
    const { order } = await res.json();
    console.log(order);
    console.log(order.amount);
    const options = {
      key: "rzp_test_ECnWPOQP1K3WYM",
      amount: order.amount,
      currency: "INR",
      name: "shivani",
      description: "Tutorial of RazorPay",
      // image: "https://avatars.githubusercontent.com/u/25058652?v=4",
      order_id: order.id,
      callback_url: "http://localhost:5000/api/paymentverification",
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#121212",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

    if (response.status === 200) {
      const deliveryAddress = deliveryAddressRef.current.value;
      console.log("Delivery Address:", deliveryAddress);

      dispatch({ type: "DROP" });
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);
  return (
    <div>
      {console.log(data)}
      <div className="container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md">
        <table className="table ">
          <thead className=" fs-4" style={{ color: "#c34040" }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody style={{ color: "black" }}>
            {data.map((food, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    type="button"
                    className="mybtn p-0 "
                    style={{ backgroundColor: "#c34040" }}
                    onClick={() => {
                      dispatch({ type: "REMOVE", index: index });
                    }}
                  >
                    delete
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h1 className="fs-2" style={{ color: "black" }}>
            Total Price: {totalPrice}/-
          </h1>
        </div>
        <div className="mb-3">
          <label
            htmlFor="exampleInputaddress"
            className="form-label"
            style={{ color: "black" }}
          >
            Delivery Address
          </label>
          <input
            type="text"
            className="myinput"
            style={{ backgroundColor: "#ffffff5e" }}
            name="deliveryAddress"
            id="exampleInputaddress"
            ref={deliveryAddressRef}
          />
        </div>
        <div>
          <button
            className="mybtn  mt-5 "
            style={{ backgroundColor: "#c34040" }}
            onClick={handleCheckOut}
          >
            {" "}
            Check Out{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
