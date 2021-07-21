import React from "react";
import Button from "./../forms/Button";
import { useHistory, useLocation } from "react-router-dom";
import UserManageProducts from "./../../components/ManageProducts/User";
import UserManageRequests from "./../../components/ManageRequests/User";
import UserManageAuctions from "./../../components/ManageAuctions/User";
import { useEffect, useState } from "react";
import "./styles.scss";

import { isMobile } from "react-device-detect";

const Manage = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [pathName, setPathName] = useState("/dashboard/manage");
  useEffect(() => {
    setPathName(location.pathname);
  }, [location]);
  if (isMobile) {
    return (
      <div>
        <div className="dashboard">
          <div className="admin">
            <div className="callToActions">
              <Button
                className={
                  pathName === "/dashboard/manage/auctions"
                    ? "activebtnblockm"
                    : "btnblockm"
                }
                onClick={() => history.push("/dashboard/manage/auctions")}
              >
                Manage Auctions
              </Button>
              <Button
                className={
                  pathName === "/dashboard/manage/products"
                    ? "activebtnblockm"
                    : "btnblockm"
                }
                onClick={() => history.push("/dashboard/manage/products")}
              >
                Manage Products
              </Button>
              <Button
                className={
                  pathName === "/dashboard/manage/requests"
                    ? "activebtnblockm"
                    : "btnblockm"
                }
                onClick={() => history.push("/dashboard/manage/requests")}
              >
                Manage Requests
              </Button>
            </div>
          </div>
          {pathName === "/dashboard/manage/requests" ? (
            <UserManageRequests />
          ) : pathName === "/dashboard/manage/products" ? (
            <UserManageProducts />
          ) : pathName === "/dashboard/manage/auctions" ? (
            <UserManageAuctions />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="dashboard">
        <div className="admin">
          <div className="callToActions">
            <ul>
              <li key={0}>
                <Button
                  className={
                    pathName === "/dashboard/manage/auctions"
                      ? "activebtnblockm"
                      : "btnblockm"
                  }
                  onClick={() => history.push("/dashboard/manage/auctions")}
                >
                  Manage Auctions
                </Button>
              </li>
              <li key={1}>
                <Button
                  className={
                    pathName === "/dashboard/manage/products"
                      ? "activebtnblockm"
                      : "btnblockm"
                  }
                  onClick={() => history.push("/dashboard/manage/products")}
                >
                  Manage Products
                </Button>
              </li>
              <li key={2}>
                <Button
                  className={
                    pathName === "/dashboard/manage/requests"
                      ? "activebtnblockm"
                      : "btnblockm"
                  }
                  onClick={() => history.push("/dashboard/manage/requests")}
                >
                  Manage Requests
                </Button>
              </li>
            </ul>
          </div>
        </div>
        {pathName === "/dashboard/manage/requests" ? (
          <UserManageRequests />
        ) : pathName === "/dashboard/manage/products" ? (
          <UserManageProducts />
        ) : pathName === "/dashboard/manage/auctions" ? (
          <UserManageAuctions />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Manage;
