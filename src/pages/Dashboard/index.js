import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getUserOrderHistory } from "./../../redux/Orders/orders.actions";
import { fetchUserNotifications } from "./../../redux/Notifications/notifications.actions";
import OrderHistory from "./../../components/OrderHistory";
import UserManageProducts from "./../../components/ManageProducts/User";
import UserManageRequests from "./../../components/ManageRequests/User";
import UserManageAuctions from "./../../components/ManageAuctions/User";
import { checkUserSession } from "./../../redux/User/user.actions";
import Button from "../../components/forms/Button";
import Notifications from "../../components/Notifications";
import ResetPassword from "../../components/ResetPassword";
import "./styles.scss";

const mapState = ({ user, ordersData, notificationsData }) => ({
  currentUser: user.currentUser,
  orderHistory: ordersData.orderHistory.data,
  notifications: notificationsData.notifications,
});

const Dashboard = (props) => {
  const { listType } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser, orderHistory, notifications } = useSelector(mapState);

  useEffect(() => {
    dispatch(getUserOrderHistory(currentUser.id));
    dispatch(fetchUserNotifications(currentUser.id));
    dispatch(checkUserSession());
  }, []);

  return (
    <div className="dashboard">
      {listType === "requests" ? (
        <UserManageRequests />
      ) : listType === "products" ? (
        <UserManageProducts />
      ) : listType === "orderhistory" ? (
        <div>
          <h1>Order History</h1>
          <p>All orders made for Products and Auctions will be shown here</p>
          <OrderHistory orders={orderHistory} />
        </div>
      ) : listType === "auctions" ? (
        <UserManageAuctions />
      ) : listType === "wallet" ? (
        <div>
          <h1>Wallet: ${currentUser.wallet / 100}</h1>

          <p>
            Money is added to your wallet whenever a product listed for sale is
            sold
          </p>
          <br></br>
          <div className="topupbtn">
            <Button
              onClick={() => {
                history.push("/wallettopup");
              }}
            >
              Top Up Now
            </Button>
          </div>
        </div>
      ) : listType === "changepassword" ? (
        <ResetPassword></ResetPassword>
      ) : (
        <div>
          <h1>Notifications</h1>
          <hr id="notificationline" />
          <Notifications notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
