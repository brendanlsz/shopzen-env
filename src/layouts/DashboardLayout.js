import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUserStart } from "./../redux/User/user.actions";

import Header from "./../components/Header";
import VerticalNav from "./../components/VerticalNav";
import Footer from "./../components/Footer";
import ChatsWrapper from "./ChatsWrapper";

const DashBoardLayout = (props) => {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(signOutUserStart());
  };

  return (
    <div className="dashboardLayout">
      <Header {...props} />
      <div className="controlPanel">
        <div className="sidebar">
          <VerticalNav>
            <ul>
              <li>
                <Link to="/dashboard/notifications">Notifications</Link>
              </li>
              <li>
                <Link to="/dashboard/orderhistory">Order History</Link>
              </li>
              <li>
                <Link to="/dashboard/manage">Manage Listings</Link>
              </li>
              <li>
                <Link to="/dashboard/changepassword">Change Password</Link>
              </li>
              <li>
                <Link to="/dashboard/wallet">Top Up Wallet</Link>
              </li>
            </ul>
          </VerticalNav>
        </div>
        <div className="content">{props.children}</div>
      </div>
      <ChatsWrapper></ChatsWrapper>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
