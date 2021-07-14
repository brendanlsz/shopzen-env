import React from "react";
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableBody,
//   TableCell,
// } from "@material-ui/core";
import Button from "../forms/Button";
import { firestore } from "../../firebase/utils";

import "./styles.scss";

import { useDispatch } from "react-redux";
import { deleteNotification } from "../../redux/Notifications/notifications.actions";
import { useHistory } from "react-router-dom";

const Notifications = ({ notifications }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  if (!Array.isArray(notifications) || !notifications.length > 0) {
    return (
      <div>
        <br></br>
        <p>No notifications to show</p>
      </div>
    );
  }

  const findAuction = (auctionID) => {
    return new Promise((resolve, reject) => {
      firestore
        .collection("auctions")
        .doc(auctionID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return (
    <div className="notifications">
      <table border="0" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td>
              <table
                className="results"
                border="0"
                cellPadding="10"
                cellSpacing="0"
              >
                <tbody>
                  {Array.isArray(notifications) &&
                    notifications.length > 0 &&
                    notifications.map((notification, index) => {
                      const {
                        notificationCreatedDate,
                        notificationContent,
                        recipientID,
                        documentID,
                        auctionID,
                      } = notification;

                      return (
                        <tr key={index}>
                          <td>
                            {notificationCreatedDate.toDate().toDateString()}
                          </td>
                          <td>{notificationContent}</td>
                          {auctionID && (
                            <td className="auction-link">
                              <Button
                                onClick={async () => {
                                  try {
                                    await findAuction(auctionID);
                                    history.push(`auction/${auctionID}`);
                                  } catch {
                                    alert(
                                      "The auction had been deleted, unable to view details"
                                    );
                                  }
                                }}
                              >
                                Auction Details
                              </Button>
                            </td>
                          )}
                          <td>
                            <Button
                              onClick={() => {
                                console.log(documentID);
                                dispatch(
                                  deleteNotification({
                                    documentID,
                                    userID: recipientID,
                                  })
                                );
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
