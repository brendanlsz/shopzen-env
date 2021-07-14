import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuctionsStart,
  deleteAuctionStart,
} from "../../../redux/Auction/auctions.actions";

import LoadMore from "../../LoadMore";
import Button from "../../forms/Button";

import "./../styles.scss";

const mapState = ({ auctionData }) => ({
  auctions: auctionData.auctions,
});

const ManageAuctions = () => {
  const { auctions } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = auctions;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuctionsStart());
  }, []);

  const handleLoadMore = () => {
    dispatch(
      fetchAuctionsStart({
        startAfterDoc: queryDoc,
        persistAuctions: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };
  return (
    <div className="manageProducts">
      <table border="0" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <th>
              <h1>Manage Auctions</h1>
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
                    data.map((auction, index) => {
                      const { auctionName, auctionThumbnail, documentID } =
                        auction;

                      return (
                        <tr key={index}>
                          <td>
                            <img className="thumb" src={auctionThumbnail} />
                          </td>
                          <td>{auctionName}</td>
                          <td>
                            <Button
                              onClick={() =>
                                dispatch(
                                  deleteAuctionStart({
                                    documentID,
                                    auctionName,
                                  })
                                )
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

export default ManageAuctions;
