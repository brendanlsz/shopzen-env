import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchRequestsStart } from "./../../redux/Requests/requests.actions";
import Request from "../Request";
import FormSelect from "./../forms/FormSelect";
import LoadMore from "./../LoadMore";
import "./styles.scss";

const mapState = ({ requestsData }) => ({
  requests: requestsData.requests,
});

const ProductResults = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { filterType } = useParams();
  const { requests } = useSelector(mapState);

  const { data, queryDoc, isLastPage } = requests;

  useEffect(() => {
    dispatch(fetchRequestsStart({ filterType }));
  }, [filterType]);

  const handleFilter = (e) => {
    const nextFilter = e.target.value;
    history.push(`/requests/${nextFilter}`);
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
      <div className="requests">
        <h1>Browse Buyer Requests</h1>
        <FormSelect {...configFilters} />
        <p>No search results.</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    dispatch(
      fetchRequestsStart({
        filterType,
        startAfterDoc: queryDoc,
        persistRequests: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };

  return (
    <div className="requests">
      <h1>Browse Buyer Requests</h1>
      <FormSelect {...configFilters} />

      <div className="requestResults">
        {data.map((request, pos) => {
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

      {!isLastPage && <LoadMore {...configLoadMore} />}
    </div>
  );
};

export default ProductResults;
