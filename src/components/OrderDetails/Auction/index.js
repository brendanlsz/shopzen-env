import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setOrderDetails } from "../../../redux/Orders/orders.actions";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

const columns = [
  {
    id: "auctionThumbnail",
    label: "",
  },
  {
    id: "auctionName",
    label: "Auction Name",
  },
  {
    id: "bidPrice",
    label: "Bidding Price",
  },
];
const styles = {
  fontSize: "16px",
  width: "10%",
};

const OrderDetails = ({ order }) => {
  const auction = order && order.auction;
  console.log(order);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setOrderDetails({}));
    };
  }, []);

  const formatText = (columnName, columnValue) => {
    switch (columnName) {
      case "auctionName":
        return columnValue;
      case "auctionThumbnail":
        return <img src={columnValue} width={250} />;
      case "bidPrice": {
        return `$${columnValue / 100}`;
      }

      default:
        return columnValue;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, pos) => {
              return (
                <TableCell key={pos} style={styles}>
                  {col.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            {columns.map((col, pos) => {
              let columnValue;
              switch (col.id) {
                case "auctionThumbnail":
                  columnValue = auction.auctionThumbnail;
                  break;
                case "auctionName":
                  columnValue = auction.auctionName;
                  break;
                case "bidPrice":
                  columnValue = auction.currentBidPrice;
                  break;
                default:
                  columnValue = "";
              }
              return (
                <TableCell key={pos} style={styles}>
                  {formatText(col.id, columnValue)}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDetails;
