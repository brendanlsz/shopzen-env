import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchProductsStart } from "./../../redux/Products/products.actions";
import Product from "../Product";
import FormSelect from "./../forms/FormSelect";
import LoadMore from "./../LoadMore";
import "./styles.scss";

const mapState = ({ productsData }) => ({
  products: productsData.products,
});

const ProductResults = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { filterType } = useParams();
  const { products } = useSelector(mapState);
  const [order, setOrder] = useState("");
  const { data, queryDoc, isLastPage } = products;

  useEffect(() => {
    dispatch(fetchProductsStart({ filterType, orderBy: order }));
  }, [filterType, order]);

  const handleFilter = (e) => {
    const nextFilter = e.target.value;
    history.push(`/products/${nextFilter}`);
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
        name: "Price (high to low)",
        value: "pricedesc",
      },
      {
        name: "Price (low to high)",
        value: "priceasc",
      },
    ],
    handleChange: handleOrder,
  };
  if (!Array.isArray(data)) return null;
  if (data.length < 1) {
    return (
      <div className="products">
        <h1>Browse Products</h1>
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
      fetchProductsStart({
        filterType,
        orderBy: order,
        startAfterDoc: queryDoc,
        persistProducts: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };

  return (
    <div className="products">
      <h1>Browse Products</h1>

      <div className="filters">
        <FormSelect {...configFilters} />
        <FormSelect {...configOrder} />
      </div>

      <div className="productResults">
        {data.map((product, pos) => {
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

      {!isLastPage && <LoadMore {...configLoadMore} />}
    </div>
  );
};

export default ProductResults;
