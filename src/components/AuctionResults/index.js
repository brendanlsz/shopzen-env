import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchAuctionsStart } from "../../redux/Auction/auctions.actions";
import Auction from "../Auction";
import FormSelect from "../forms/FormSelect";
import LoadMore from "../LoadMore";
import "./styles.scss";

const mapState = ({ auctionData }) => ({
  auctions: auctionData.auctions,
});

const AuctionResults = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { filterType } = useParams();
  const { auctions } = useSelector(mapState);

  const { data, queryDoc, isLastPage } = auctions;

  useEffect(() => {
    dispatch(fetchAuctionsStart({ filterType }));
  }, [filterType]);

  const handleFilter = (e) => {
    const nextFilter = e.target.value;
    history.push(`/auctions/${nextFilter}`);
  };

  const configFilters = {
    defaultValue: filterType,
    options: [
      {
        name: "Show all",
        value: "",
      },
      {
        name: "Electronics",
        value: "electronics",
      },
      {
        name: "Others",
        value: "others",
      },
    ],
    handleChange: handleFilter,
  };
  if (!Array.isArray(data)) return null;
  if (data.length < 1) {
    return (
      <div className="auctions">
        <h1>Browse Auctions</h1>
        <FormSelect {...configFilters} />
        <p>No search results.</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    dispatch(
      fetchAuctionsStart({
        filterType,
        startAfterDoc: queryDoc,
        persistAuctions: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };

  return (
    <div className="auctions">
      <h1>Browse Auctions</h1>

      <FormSelect {...configFilters} />

      <div className="auctionResults">
        {data.map((auction, pos) => {
          const { auctionThumbnail, auctionName, currentBidPrice } = auction;
          if (
            !auctionThumbnail ||
            !auctionName ||
            typeof currentBidPrice === "undefined"
          )
            return null;

          const configAuction = {
            ...auction,
          };

          return <Auction key={pos} {...configAuction} />;
        })}
      </div>

      {!isLastPage && <LoadMore {...configLoadMore} />}
    </div>
  );
};

export default AuctionResults;
