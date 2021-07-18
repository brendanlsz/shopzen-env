import React, { useEffect, useState } from "react";
import Rating from "../Rating";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { useDispatch } from "react-redux";
import { setOrderDetails } from "../../../redux/Orders/orders.actions";

const columns = [
  {
    id: "productThumbnail",
    label: "",
  },
  {
    id: "productName",
    label: "Name",
  },
  {
    id: "productPrice",
    label: "Price",
  },
  {
    id: "quantity",
    label: "Quantity",
  },
  { id: "ratingDetails", label: "Rating" },
];

const styles = {
  fontSize: "16px",
  width: "10%",
};

const OrderDetails = ({ order }) => {
  const dispatch = useDispatch();
  const orderItems = order && order.orderItems;

  useEffect(() => {
    return () => {
      dispatch(setOrderDetails({}));
    };
  }, []);

  const formatText = (columnName, columnValue) => {
    switch (columnName) {
      case "productPrice":
        return `$${columnValue / 100}`;
      case "productThumbnail":
        return <img src={columnValue} width={250} />;
      case "ratingDetails": {
        console.log(columnValue);
        return <Rating ratingDetails={columnValue} />;
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
          {Array.isArray(orderItems) &&
            orderItems.length > 0 &&
            orderItems.map((row, pos) => {
              return (
                <TableRow key={pos}>
                  {columns.map((col, pos) => {
                    const columnName = col.id;
                    const columnValue = row[columnName];
                    console.log(columnName, columnValue);

                    return (
                      <TableCell key={pos} style={styles}>
                        {formatText(columnName, columnValue)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDetails;
