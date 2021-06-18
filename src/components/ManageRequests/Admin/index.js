import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestsStart,
  deleteRequestStart,
} from "../../../redux/Requests/requests.actions";

import LoadMore from "../../LoadMore";
import Button from "../../forms/Button";

import "./../styles.scss";

const mapState = ({ requestsData }) => ({
  requests: requestsData.requests,
});

const ManageRequests = () => {
  const { requests } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = requests;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequestsStart());
  }, []);

  const handleLoadMore = () => {
    dispatch(
      fetchRequestsStart({
        startAfterDoc: queryDoc,
        persistRequests: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };
  return (
    <div className="manageRequests">
      <table border="0" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <th>
              <h1>Manage Requests</h1>
            </th>
          </tr>
          <tr>
            <td>
              <table
                className="results"
                border="0"
                cellPadding="10"
                cellSpacing="0"
              >
                <tbody>
                  {Array.isArray(data) &&
                    data.length > 0 &&
                    data.map((request, index) => {
                      const {
                        requestName,
                        requestThumbnail,
                        requestPrice,
                        documentID,
                      } = request;

                      return (
                        <tr key={index}>
                          <td>
                            <img className="thumb" src={requestThumbnail} />
                          </td>
                          <td>{requestName}</td>
                          <td>${requestPrice}</td>
                          <td>
                            <Button
                              onClick={() =>
                                dispatch(deleteRequestStart(documentID))
                              }
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
          <tr>
            <td>
              <table border="0" cellPadding="10" cellSpacing="0">
                <tbody>
                  <tr>
                    <td>{!isLastPage && <LoadMore {...configLoadMore} />}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageRequests;
