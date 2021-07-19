import React from 'react';
import Button from "./../forms/Button";
import UserManageProducts from "./../../components/ManageProducts/User";
import UserManageRequests from "./../../components/ManageRequests/User";
import UserManageAuctions from "./../../components/ManageAuctions/User";
import { useEffect, useState } from "react";
import "./styles.scss"
import { isMemberExpression } from '@babel/types';
import { isBrowser, isMobile } from "react-device-detect";


const Manage = (props) => {
    console.log(props)
    const {list} = props 
    console.log(list)
    const [sta, setSta] = useState(2)
    if (isMobile) {
      return (
        <div>
          <div className="dashboard">
            <div className="admin">
              <div className="callToActions">
                <Button
                  className={sta == 2 ? "activebtnblockm" : "btnblockm"}
                  onClick={() => setSta(2)}
                >
                  Manage Auctions
                </Button>
                <Button
                  className={sta == 1 ? "activebtnblockm" : "btnblockm"}
                  onClick={() => setSta(1)}
                >
                  Manage Products
                </Button>
                <Button
                  className={sta == 0 ? "activebtnblockm" : "btnblockm"}
                  onClick={() => setSta(0)}
                >
                  Manage Requests
                </Button>
              </div>
            </div>
            {sta == "0" ? (
              <UserManageRequests />
            ) : sta == "1" ? (
              <UserManageProducts />
            ) : sta == "2" ? (
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
                    className={sta == 2 ? "activebtnblockm" : "btnblockm"}
                    onClick={() => setSta(2)}
                  >
                    Manage Auctions
                  </Button>
                </li>
                <li key={1}>
                  <Button
                    className={sta == 1 ? "activebtnblockm" : "btnblockm"}
                    onClick={() => setSta(1)}
                  >
                    Manage Products
                  </Button>
                </li>
                <li key={2}>
                  <Button
                    className={sta == 0 ? "activebtnblockm" : "btnblockm"}
                    onClick={() => setSta(0)}
                  >
                    Manage Requests
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          {sta == "0" ? (
            <UserManageRequests />
          ) : sta == "1" ? (
            <UserManageProducts />
          ) : sta == "2" ? (
            <UserManageAuctions />
          ) : (
            <div />
          )}
        </div>
      </div>
    );

}

export default Manage;