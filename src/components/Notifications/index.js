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

import { useDispatch } from "react-redux";
import { deleteNotification } from "../../redux/Notifications/notifications.actions";

const Notifications = ({ notifications }) => {
  const dispatch = useDispatch();
  return (
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
                    } = notification;

                    return (
                      <tr key={index}>
                        <td>
                          {notificationCreatedDate.toDate().toDateString()}
                        </td>
                        <td>{notificationContent}</td>
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
  );
};

export default Notifications;
