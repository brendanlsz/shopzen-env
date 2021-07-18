import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetailsStart } from "./../../redux/Orders/orders.actions";
import { useDispatch, useSelector } from "react-redux";
import ProductOrderDetails from "./../../components/OrderDetails/Product";
import AuctionOrderDetails from "./../../components/OrderDetails/Auction";

const mapState = ({ ordersData }) => ({
  orderDetails: ordersData.orderDetails,
});

const Order = () => {
  const { orderID } = useParams();
  const dispatch = useDispatch();
  const { orderDetails } = useSelector(mapState);
  const { orderTotal, orderType } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetailsStart(orderID));
  }, []);

  return (
    <div>
      <h1>Order ID: #{orderID}</h1>
      {orderType === "product" ? (
        <ProductOrderDetails order={orderDetails} />
      ) : orderType === "auction" ? (
        <AuctionOrderDetails order={orderDetails} />
      ) : (
        <div></div>
      )}

      {orderType === "product" && <h3>Total: ${orderTotal / 100}</h3>}
    </div>
  );
};

export default Order;
