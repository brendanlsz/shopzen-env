import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductStart } from "./../../redux/Products/products.actions";
import { addRequestStart } from "./../../redux/Requests/requests.actions";
import Modal from "./../../components/Modal";
import FormInput from "./../../components/forms/FormInput";
import FormSelect from "./../../components/forms/FormSelect";
import Button from "./../../components/forms/Button";

import CKEditor from "ckeditor4-react";

import "./styles.scss";

const Admin = (props) => {
  const dispatch = useDispatch();
  const [hideProductModal, setHideProductModal] = useState(true);
  const [hideRequestModal, setHideRequestModal] = useState(true);
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [requestCategory, setRequestCategory] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestThumbnail, setRequestThumbnail] = useState("");
  const [requestPrice, setRequestPrice] = useState(0);
  const [requestDesc, setRequestDesc] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  const toggleProductModal = () => setHideProductModal(!hideProductModal);

  const configProductModal = {
    hideModal: hideProductModal,
    toggleModal: toggleProductModal,
  };

  const toggleRequestModal = () => setHideRequestModal(!hideRequestModal);

  const configRequestModal = {
    hideModal: hideRequestModal,
    toggleModal: toggleRequestModal,
  };

  const resetForm = () => {
    setHideProductModal(true);
    setHideRequestModal(true);
    setProductCategory("");
    setProductName("");
    setProductThumbnail("");
    setProductPrice(0);
    setProductDesc("");
    setProductDetails("");
    setRequestCategory("");
    setRequestName("");
    setRequestThumbnail("");
    setRequestPrice(0);
    setRequestDesc("");
    setRequestDetails("");
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

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (requestCategory !== "") {
      dispatch(
        addRequestStart({
          requestCategory,
          requestName,
          requestThumbnail,
          requestPrice,
          requestDesc,
          requestDetails,
          lowerCaseName: requestName.toLowerCase(),
        })
      );
      resetForm();
    } else {
      alert("Please choose a category");
    }
  };

  return (
    <div className="admin">
      <div className="callToActions">
        <ul>
          <li key={0}>
            <Button onClick={() => toggleProductModal()}>
              Add new product
            </Button>
          </li>
          <li key={1}>
            <Button onClick={() => toggleRequestModal()}>
              Make a new request
            </Button>
          </li>
        </ul>
      </div>

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

      <Modal {...configRequestModal}>
        <div className="addNewForm">
          <form onSubmit={handleRequestSubmit}>
            <h2>Add new request</h2>
            <FormInput
              label="Name"
              placeholder="Name of Item Requested"
              required
              type="text"
              value={requestName}
              handleChange={(e) => setRequestName(e.target.value)}
            />
            <FormInput
              label="Main image URL"
              type="url"
              placeholder="URL to image of item requested"
              value={requestThumbnail}
              handleChange={(e) => setRequestThumbnail(e.target.value)}
            />
            <FormInput
              label="Price"
              type="number"
              min="0.00"
              max="10000.00"
              step="0.01"
              placeholder="Amount Willing to pay"
              value={requestPrice}
              required
              handleChange={(e) => setRequestPrice(e.target.value)}
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
              handleChange={(e) => setRequestCategory(e.target.value)}
            />
            <FormInput
              label="Description"
              type="description"
              required
              handleChange={(evt) => setRequestDesc(evt.target.value)}
              placeholder="Short description of item requested"
            />
            <label>Details/Specifications(Optional)</label>
            <CKEditor
              onChange={(evt) => setRequestDetails(evt.editor.getData())}
            />

            <br />
            <Button type="submit">Add request</Button>
          </form>
        </div>
      </Modal>

      <div className="content">{props.children}</div>
    </div>
  );
};

export default Admin;
