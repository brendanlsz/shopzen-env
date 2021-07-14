import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAuctions,
  deleteAuctionStart,
  addAuctionStart,
  resolveAuctionStart,
} from "../../redux/Auction/auctions.actions";
import { Link } from "react-router-dom";
import { storage } from "../../firebase/upload";
import { v4 as uuidv4 } from "uuid";

import LoadMore from "../LoadMore";
import Button from "../forms/Button";
import Modal from "../Modal";
import FormInput from "../forms/FormInput";
import FormSelect from "../forms/FormSelect";
import CKEditor from "ckeditor4-react";

import "./styles.scss";

const mapState = ({ auctionData, user }) => ({
  auctions: auctionData.userAuctions,
  userID: user.currentUser.id,
});

const ManageAuctions = (props) => {
  const { auctions, userID } = useSelector(mapState);
  const { data, queryDoc, isLastPage } = auctions;
  const dispatch = useDispatch();
  const [hideAuctionModal, setHideAuctionModal] = useState(true);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [auctionCategory, setAuctionCategory] = useState("");
  const [auctionName, setAuctionName] = useState("");
  // const [productPrice, setProductPrice] = useState(0);
  const [auctionDesc, setAuctionDesc] = useState("");
  const [auctionDetails, setAuctionDetails] = useState("");

  useEffect(() => {
    dispatch(fetchUserAuctions({ userID }));
  }, []);

  const toggleAuctionModal = () => setHideAuctionModal(!hideAuctionModal);

  const configAuctionModal = {
    hideModal: hideAuctionModal,
    toggleModal: toggleAuctionModal,
  };

  const resetForm = () => {
    setHideAuctionModal(true);
    setAuctionCategory("");
    setAuctionName("");
    setAuctionDesc("");
    setAuctionDetails("");
    setImage(null);
  };

  const handleAuctionSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4();
    if (auctionCategory !== "" && image !== null) {
      const uploadTask = storage.ref(`images/${id}-${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(`images/${id}-${image.name}`)
            .getDownloadURL()
            .then((url) => {
              dispatch(
                addAuctionStart({
                  auctionCategory,
                  auctionName,
                  auctionThumbnail: url,
                  numberOfBids: 0,
                  auctionDesc,
                  auctionDetails,
                  lowerCaseName: auctionName.toLowerCase(),
                  imageName: `${id}-${image.name}`,
                })
              );
              resetForm();
            });
        }
      );
    } else if (auctionCategory === "") {
      alert("Please choose a category");
    } else {
      alert("Please add an image");
    }
  };

  const handleLoadMore = () => {
    dispatch(
      fetchUserAuctions({
        userID,
        startAfterDoc: queryDoc,
        persistAuctions: data,
      })
    );
  };

  const configLoadMore = {
    onLoadMoreEvt: handleLoadMore,
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="manageProductsmodalversion">
      <Modal {...configAuctionModal}>
        <div className="addNewForm">
          <form onSubmit={handleAuctionSubmit}>
            <h2>Add new Item for Auction</h2>
            <FormInput
              label="Name"
              placeholder="Name of Item"
              required
              type="text"
              value={auctionName}
              handleChange={(e) => setAuctionName(e.target.value)}
            />
            <FormInput
              label="Main image upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
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
              handleChange={(e) => setAuctionCategory(e.target.value)}
            />
            <FormInput
              label="Description"
              type="description"
              required
              handleChange={(evt) => setAuctionDesc(evt.target.value)}
              placeholder="Short description of item"
            />
            <label>Details/Specifications(Optional)</label>
            <CKEditor
              onChange={(evt) => setAuctionDetails(evt.editor.getData())}
            />
            <br />
            <Button type="submit">Add auction</Button>
          </form>
        </div>
      </Modal>
      <table border="0" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <th>
            </th>
          </tr>
          <tr>
            <th>
              <Button onClick={toggleAuctionModal}>
                Create Auction for a Product
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
                    data.map((auction, index) => {
                      const {
                        auctionName,
                        auctionThumbnail,
                        currentBidPrice,
                        documentID,
                      } = auction;

                      return (
                        <tr key={index}>
                          <td>
                            <Link to={`/auction/${documentID}`}>
                              <img
                                className="thumb"
                                src={auctionThumbnail}
                                alt="nothumbnail"
                              />
                            </Link>
                          </td>
                          <td>{auctionName}</td>
                          <td>
                            Highest Bid:{" "}
                            {currentBidPrice > 0 ? (
                              <strong>${currentBidPrice / 100}</strong>
                            ) : (
                              <strong>No bids yet</strong>
                            )}
                          </td>

                          <td>
                            <Button
                              onClick={() =>
                                props.changeUrl(
                                  `http://localhost:3000/auction/${documentID}`
                                )
                              }
                            >
                              Send item
                            </Button>
                          </td>
                          {currentBidPrice > 0 ? (
                            <td>
                              <Button
                                onClick={() => {
                                  dispatch(
                                    resolveAuctionStart({
                                      documentID,
                                      auctionName,
                                    })
                                  );
                                }}
                              >
                                Resolve
                              </Button>
                            </td>
                          ) : (
                            <div />
                          )}
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
