import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProducts,
  deleteProductStart,
  addProductStart,
} from "../../../redux/Products/products.actions";
import { Link } from "react-router-dom";

import LoadMore from "../../LoadMore";
import Button from "../../forms/Button";
import Modal from "./../../Modal";
import FormInput from "./../../forms/FormInput";
import FormSelect from "./../../forms/FormSelect";
import CKEditor from "ckeditor4-react";

import "./../styles.scss";

const mapState = ({ productsData, user }) => ({
  products: productsData.userProducts,
  userID: user.currentUser.id,
});

const ManageProducts = () => {
  const { products, userID } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = products;
  const dispatch = useDispatch();
  const [hideProductModal, setHideProductModal] = useState(true);
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productDetails, setProductDetails] = useState("");

  useEffect(() => {
    dispatch(fetchUserProducts({ userID }));
  }, []);

  const toggleProductModal = () => setHideProductModal(!hideProductModal);

  const configProductModal = {
    hideModal: hideProductModal,
    toggleModal: toggleProductModal,
  };

  const resetForm = () => {
    setHideProductModal(true);
    setProductCategory("");
    setProductName("");
    setProductThumbnail("");
    setProductPrice(0);
    setProductDesc("");
    setProductDetails("");
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (productCategory !== "") {
      dispatch(
        addProductStart({
          productCategory,
          productName,
          productThumbnail,
          productPrice,
          productDesc,
          productDetails,
          lowerCaseName: productName.toLowerCase(),
        })
      );
      resetForm();
    } else {
      alert("Please choose a category");
    }
  };

  const handleLoadMore = () => {
    dispatch(
      fetchUserProducts({
        userID,
        startAfterDoc: queryDoc,
        persistProducts: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };
  return (
    <div className="manageProducts">
      <Modal {...configProductModal}>
        <div className="addNewForm">
          <form onSubmit={handleProductSubmit}>
            <h2>Add new product</h2>
            <FormInput
              label="Name"
              placeholder="Name of Item"
              required
              type="text"
              value={productName}
              handleChange={(e) => setProductName(e.target.value)}
            />
            <FormInput
              label="Main image URL"
              type="url"
              placeholder="URL to image of item"
              value={productThumbnail}
              handleChange={(e) => setProductThumbnail(e.target.value)}
            />
            <FormInput
              label="Price"
              type="number"
              min="0.00"
              max="10000.00"
              step="0.01"
              placeholder="Price of item"
              value={productPrice}
              required
              handleChange={(e) => setProductPrice(e.target.value)}
            />
            <FormSelect
              label="Category"
              className="category"
              required
              options={[
                {
                  value: "electronics",
                  name: "Electronics",
                },
                {
                  value: "others",
                  name: "Others",
                },
              ]}
              handleChange={(e) => setProductCategory(e.target.value)}
            />
            <FormInput
              label="Description"
              type="description"
              required
              handleChange={(evt) => setProductDesc(evt.target.value)}
              placeholder="Short description of item"
            />
            {/* <FormInput
              label="Details"
              type="text"
              placeholder="Include any details or specification of item"
              handleChange={(e) => setProductDetails(e.target.value)} />*/}
            <label>Details/Specifications(Optional)</label>
            <CKEditor
              onChange={(evt) => setProductDetails(evt.editor.getData())}
            />
            <br />
            <Button type="submit">Add product</Button>
          </form>
        </div>
      </Modal>
      <table border="0" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <th>
              <h1>Manage Products</h1>
            </th>
          </tr>
          <tr>
            <th>
              <Button onClick={toggleProductModal}>
                List Product for Sale
              </Button>
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
                    data.map((product, index) => {
                      const {
                        productName,
                        productThumbnail,
                        productPrice,
                        documentID,
                        quantitysold,
                      } = product;

                      return (
                        <tr key={index}>
                          <td>
                            <Link to={`/product/${documentID}`}>
                              <img
                                className="thumb"
                                src={productThumbnail}
                                alt="nothumbnail"
                              />
                            </Link>
                          </td>
                          <td>{productName}</td>
                          <td>${productPrice}</td>
                          <td>Quantity Sold: {quantitysold}</td>
                          <td>
                            <Button
                              onClick={() => {
                                dispatch(deleteProductStart(documentID));
                              }}
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

export default ManageProducts;
