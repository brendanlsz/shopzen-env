import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { checkUserSession } from "./redux/User/user.actions";

// components
import AdminToolbar from "./components/AdminToolbar";
import ManageProducts from "./components/ManageProducts/Admin";
import ManageRequests from "./components/ManageRequests/Admin";
import createUser from "./components/Chats/createChatUserNoProfilePic";
import createUserNoPP from "./components/Chats/createChatUserNoProfilePic";

// hoc
import WithAuth from "./hoc/withAuth";
import WithAdminAuth from "./hoc/withAdminAuth";

// layouts
import MainLayout from "./layouts/MainLayout";
import MainLayoutNoChat from "./layouts/MainLayoutNoChat";
import HomepageLayout from "./layouts/HomepageLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// pages
import Homepage from "./pages/Homepage";
import Products from "./pages/Products";
import Auctions from "./pages/Auctions";
import BuyerRequests from "./pages/BuyerRequest";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Recovery from "./pages/Recovery";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ProductDetails from "./pages/ProductDetails";
import RequestDetails from "./pages/RequestDetails";
import AuctionDetails from "./pages/AuctionDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Order from "./pages/Order";
import Search from "./pages/Search/";
import WalletTopUp from "./pages/WalletTopUp";

//firebase
import { auth } from "./firebase/utils";
import { getUserEmail, getCurrUserEmail } from "./firebase/utils";
import firebase from "firebase";
import { signOutUserStart } from "./redux/User/user.actions";
import { Link, useHistory } from "react-router-dom";
import "./default.scss";
import ManageAuctions from "./components/ManageAuctions/Admin";
import FirstTimeLogin from "./pages/FirstTimeLogin";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
});

const App = (props) => {
  const { currentUser } = useSelector(mapState);
  var user = firebase.auth().currentUser;
  const history = useHistory();
  let email2 = "";

  useEffect(() => {
    getCurrUserEmail().then((email) => {
      setUserEmail2(email);
      setTimeout(() => {}, 5000);
    });
  }, [currentUser]);

  useEffect(() => {
    if (user != null) {
      if (user.emailVerified) {
        console.log("verified");
      } else if (user.email === "test@shopzen.com") {
        console.log("test account");
      } else {
        user.sendEmailVerification();
        history.push("/login");
        alert("Please check your inbox and verify your email address");
        dispatch(signOutUserStart());
        setTimeout(() => {
          history.push("/login");
        }, 150);
      }
    }
  }, [user]);

  function setUserEmail2(email) {
    email2 = email;
    console.log(email2);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession());
  }, []);

  if (currentUser && !currentUser.userName) {
    return (
      <div className="App">
        <MainLayout>
          <FirstTimeLogin />
        </MainLayout>
      </div>
    );
  }

  return (
    <div className="App">
      <AdminToolbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <HomepageLayout>
              <Homepage />
            </HomepageLayout>
          )}
        />
        <Route
          exact
          path="/search/:queryType"
          render={() => (
            <MainLayout>
              <Search />
            </MainLayout>
          )}
        />
        <Route
          exact
          path="/products"
          render={() => (
            <MainLayout>
              <Products />
            </MainLayout>
          )}
        />
        <Route
          path="/products/:filterType"
          render={() => (
            <MainLayout>
              <Products />
            </MainLayout>
          )}
        />
        <Route
          path="/product/:productID"
          render={() => (
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          )}
        />
        <Route
          exact
          path="/auctions"
          render={() => (
            <MainLayout>
              <Auctions />
            </MainLayout>
          )}
        />
        <Route
          path="/auctions/:filterType"
          render={() => (
            <MainLayout>
              <Auctions />
            </MainLayout>
          )}
        />
        <Route
          path="/auction/:auctionID"
          render={() => (
            <MainLayout>
              <AuctionDetails />
            </MainLayout>
          )}
        />

        <Route
          exact
          path="/requests"
          render={() => (
            <MainLayout>
              <BuyerRequests />
            </MainLayout>
          )}
        />
        <Route
          path="/requests/:filterType"
          render={() => (
            <MainLayout>
              <BuyerRequests />
            </MainLayout>
          )}
        />
        <Route
          path="/request/:requestID"
          render={() => (
            <MainLayout>
              <RequestDetails />
            </MainLayout>
          )}
        />

        <Route
          path="/cart"
          render={() => (
            <WithAuth>
              <MainLayout>
                <Cart />
              </MainLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/payment"
          render={() => (
            <WithAuth>
              <MainLayout>
                <Payment />
              </MainLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/wallettopup"
          render={() => (
            <WithAuth>
              <MainLayout>
                <WalletTopUp />
              </MainLayout>
            </WithAuth>
          )}
        ></Route>
        <Route
          path="/registration"
          render={() => (
            <MainLayout>
              <Registration />
            </MainLayout>
          )}
        />
        <Route
          path="/login"
          render={() => (
            <MainLayout>
              <Login />
            </MainLayout>
          )}
        />
        <Route
          path="/recovery"
          render={() => (
            <MainLayout>
              <Recovery />
            </MainLayout>
          )}
        />
        <Route
          exact
          path="/dashboard"
          render={() => (
            <WithAuth>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/dashboard/:listType"
          render={() => (
            <WithAuth>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/order/:orderID"
          render={() => (
            <WithAuth>
              <DashboardLayout>
                <Order />
              </DashboardLayout>
            </WithAuth>
          )}
        />
        <Route
          exact
          path="/admin"
          render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin>
                  <ManageProducts />
                </Admin>
              </AdminLayout>
            </WithAdminAuth>
          )}
        />
        <Route
          path="/admin/manageproducts"
          render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin>
                  <ManageProducts />
                </Admin>
              </AdminLayout>
            </WithAdminAuth>
          )}
        />
        <Route
          path="/admin/manageauctions"
          render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin>
                  <ManageAuctions />
                </Admin>
              </AdminLayout>
            </WithAdminAuth>
          )}
        />
        <Route
          path="/admin/managerequests"
          render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin>
                  <ManageRequests />
                </Admin>
              </AdminLayout>
            </WithAdminAuth>
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
