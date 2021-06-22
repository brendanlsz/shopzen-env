import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { startSearch } from "./../../redux/Search/search.actions";
import "./Searchbar.scss";

const Searchbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [queryType, setQueryType] = useState("products");
  const [searchInput, setSearchInput] = useState("");

  // useEffect = () => {};
  const handleSearch = () => {
    if (searchInput !== "") {
      dispatch(startSearch({ searchInput, queryType }));
      history.push(`/search/${queryType}`);
    }
  };

  const handleSearchFieldChange = (evt) => {
    setSearchInput(evt.target.value);
    // console.log(evt.target.value.toUpperCase());
  };

  const handleFilter = (e) => {
    setQueryType(e.target.value);
  };

  const configFilters = {
    defaultValue: "products",
    options: [
      {
        name: "Products",
        value: "products",
      },
      {
        name: "Requests",
        value: "requests",
      },
    ],
    handleChange: handleFilter,
  };

  const handleKeypress = (e) => {
    handleSearchFieldChange(e);
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="searchquery">
        <div className="searchquery-title">Search Field:</div>
        <select className="querySelect" onChange={handleFilter}>
          <option selected key={1} value="products">
            Products
          </option>
          <option key={2} value="requests">
            Requests
          </option>
        </select>
      </div>
      <div className="search">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          name="searchtext"
          onChange={(e) => {
            handleSearchFieldChange(e);
          }}
          onKeyDown={(e) => handleKeypress(e)}
        />{" "}
        <button onClick={() => handleSearch()} className="search-icon">
          {" "}
          <i className="fa fa-search"></i>{" "}
        </button>{" "}
      </div>
    </div>
  );
};

export default Searchbar;
