import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserRequests,
  deleteRequestStart,
  addRequestStart,
} from "../../../redux/Requests/requests.actions";

import { Link } from "react-router-dom";

import LoadMore from "../../LoadMore";
import Button from "../../forms/Button";
import Modal from "./../../Modal";
import FormInput from "./../../forms/FormInput";
import FormSelect from "./../../forms/FormSelect";
import CKEditor from "ckeditor4-react";

import "./../styles.scss";

import "./../styles.scss";

const mapState = ({ requestsData, user }) => ({
  requests: requestsData.userRequests,
  userID: user.currentUser.id,
});

const ManageRequests = () => {
  const { requests, userID } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = requests;
  const dispatch = useDispatch();
  const [hideRequestModal, setHideRequestModal] = useState(true);
  const [requestCategory, setRequestCategory] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestThumbnail, setRequestThumbnail] = useState("");
  const [requestPrice, setRequestPrice] = useState(0);
  const [requestDesc, setRequestDesc] = useState("");
  const [requestDetails, setRequestDetails] = useState("");

  useEffect(() => {
    dispatch(fetchUserRequests({ userID }));
  }, []);

  const toggleRequestModal = () => setHideRequestModal(!hideRequestModal);

  const configRequestModal = {
    hideModal: hideRequestModal,
    toggleModal: toggleRequestModal,
  };

  const resetForm = () => {
    setHideRequestModal(true);
    setRequestCategory("");
    setRequestName("");
    setRequestThumbnail("");
    setRequestPrice(0);
    setRequestDesc("");
    setRequestDetails("");
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

  const handleLoadMore = () => {
    dispatch(
      fetchUserRequests({
        userID,
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
      <Modal {...configRequestModal}>
        <div className="addNewForm">
          <form onSubmit={handleRequestSubmit}>
            <h2>Add new request</h2>
            <FormInput
              label="Name"
              placeholder="Name of Item"
              required
              type="text"
              value={requestName}
              handleChange={(e) => setRequestName(e.target.value)}
            />
            <FormInput
              label="Main image URL"
              type="url"
              placeholder="URL to image of item"
              value={requestThumbnail}
              handleChange={(e) => setRequestThumbnail(e.target.value)}
            />
            <FormInput
              label="Price"
              type="number"
              min="0.00"
              max="10000.00"
              step="0.01"
              placeholder="Price of item"
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
              placeholder="Short description of item"
            />
            {/* <FormInput
              label="Details"
              type="text"
              placeholder="Include any details or specification of item"
              handleChange={(e) => setRequestDetails(e.target.value)} />*/}
            <label>Details/Specifications(Optional)</label>
            <CKEditor
              onChange={(evt) => setRequestDetails(evt.editor.getData())}
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
              <h1>Manage Requests</h1>
            </th>
          </tr>
          <tr>
            <th>
              <Button onClick={toggleRequestModal}>
                Add a new Buy Request
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
                            <Link to={`/request/${documentID}`}>
                              <img
                                className="thumb"
                                src={requestThumbnail}
                                alt="No Thumbnail found"
                              />
                            </Link>
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
