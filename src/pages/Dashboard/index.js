import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getUserOrderHistory } from "./../../redux/Orders/orders.actions";
import OrderHistory from "./../../components/OrderHistory";
import UserManageProducts from "./../../components/ManageProducts/User";
import UserManageRequests from "./../../components/ManageRequests/User";
import { checkUserSession } from "./../../redux/User/user.actions";
import Button from "../../components/forms/Button";

import "./styles.scss";

const mapState = ({ user, ordersData }) => ({
  currentUser: user.currentUser,
  orderHistory: ordersData.orderHistory.data,
});

const Dashboard = (props) => {
  const { listType } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser, orderHistory } = useSelector(mapState);

  useEffect(() => {
    dispatch(getUserOrderHistory(currentUser.id));
    dispatch(checkUserSession());
  }, []);

  return (
    <div className="dashboard">
      <h1>Wallet: ${currentUser.wallet / 100}</h1>
      <p>
        Money is added to your wallet whenever a product listed for sale is sold
      </p>
      <div className="topupbtn">
        <Button
          onClick={() => {
            history.push("/wallettopup");
          }}
        >
          Top Up
        </Button>
      </div>

      {listType === "requests" ? (
        <UserManageRequests />
      ) : listType === "products" ? (
        <UserManageProducts />
      ) : listType === "orderhistory" ? (
        <div>
          <h1>Order History</h1>
          <OrderHistory orders={orderHistory} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Dashboard;
