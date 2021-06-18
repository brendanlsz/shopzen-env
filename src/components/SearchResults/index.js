import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Product from "../Product";
import Request from "../Request";
import LoadMore from "./../LoadMore";
import "./styles.scss";

const mapState = ({ searchData }) => ({
  searchResults: searchData.searchResults,
});

const SearchResults = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { searchResults } = useSelector(mapState);
  const { result, isLastPage } = searchResults;
  const { queryType } = useParams();

  if (
    !Array.isArray(result) ||
    (queryType !== "products" && queryType !== "requests")
  )
    return null;
  if (result.length < 1) {
    return (
      <div className="searchResults">
        <h1>Search Results</h1>
        <p>No search results.</p>
      </div>
    );
  }
  return (
    <div className="searchResults">
      <h1>Search Results</h1>

      {queryType === "products" ? (
        <div className="search-list">
          {result.map((product, pos) => {
            const { productThumbnail, productName, productPrice } = product;
            if (
              !productThumbnail ||
              !productName ||
              typeof productPrice === "undefined"
            )
              return null;

            const configProduct = {
              ...product,
            };

            return <Product key={pos} {...configProduct} />;
          })}
        </div>
      ) : queryType === "requests" ? (
        <div className="search-list">
          {result.map((request, pos) => {
            const { requestThumbnail, requestName, requestPrice } = request;
            if (
              !requestThumbnail ||
              !requestName ||
              typeof requestPrice === "undefined"
            )
              return null;

            const configRequest = {
              ...request,
            };

            return <Request key={pos} {...configRequest} />;
          })}
        </div>
      ) : (
        <div />
      )}

      {/* {!isLastPage && <LoadMore {...configLoadMore} />} */}
    </div>
  );
};

export default SearchResults;
