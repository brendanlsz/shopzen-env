import React, { useEffect, useState } from "react";
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
  const [order, setOrder] = useState("");

  const { data, queryDoc, isLastPage } = auctions;

  useEffect(() => {
    dispatch(fetchAuctionsStart({ filterType, orderBy: order }));
  }, [filterType, order]);

  const handleFilter = (e) => {
    const nextFilter = e.target.value;
    history.push(`/auctions/${nextFilter}`);
  };
  const handleOrder = (e) => {
    const nextFilter = e.target.value;
    setOrder(nextFilter);
  };

  const configFilters = {
    placeholder: "Please select a category",
    defaultValue: filterType,
    options: [
      {
        name: "Show all",
        value: "",
      },
      {
        name: "Electronic Devices",
        value: "Electronic Devices",
      },
      {
        name: "Electronic Accessories",
        value: "Electronic Accessories",
      },
      {
        name: "Home Appliances",
        value: "Home Appliances",
      },
      {
        name: "Health and Beauty",
        value: "Health and Beauty",
      },
      {
        name: "Childcare",
        value: "Childcare",
      },
      {
        name: "Home and Lifestyle",
        value: "Home and Lifestyle",
      },
      {
        name: "Men's Fashion",
        value: "Men's Fashion",
      },
      {
        name: "Women's Fashion",
        value: "Women's Fashion",
      },
      {
        name: "Cars",
        value: "Cars",
      },
      {
        name: "Automotive Accessories",
        value: "Automotive Accessories",
      },
      {
        name: "Properties",
        value: "Properties",
      },
      {
        name: "Others",
        value: "others",
      },
    ],
    handleChange: handleFilter,
  };
  const configOrder = {
    placeholder: "Please select an ordering option",

    options: [
      {
        name: "Recently Added",
        value: "recent",
      },
      {
        name: "Popularity",
        value: "popularity",
      },
      {
        name: "Bid Price",
        value: "price",
      },
    ],
    handleChange: handleOrder,
  };
  if (!Array.isArray(data)) return null;
  if (data.length < 1) {
    return (
      <div className="auctions">
        <h1>Browse Auctions</h1>
        <div className="filters">
          <FormSelect {...configFilters} />
          <FormSelect {...configOrder} />
        </div>
        <p>No search results.</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    dispatch(
      fetchAuctionsStart({
        filterType,
        orderBy: order,
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

      <div className="filters">
        <FormSelect {...configFilters} />
        <FormSelect {...configOrder} />
      </div>

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
