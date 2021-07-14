import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuctionStart,
  fetchRecAuctions,
  setAuction,
  setRecAuctions,
  bidAuctionStart,
} from "./../../redux/Auction/auctions.actions";
import Button from "./../forms/Button";
import "./styles.scss";
import Auction from "./../Auction";
import { Redirect } from "react-router-dom";
import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";
import { isBrowser, isMobile } from "react-device-detect";
import WithAuth from "../../hoc/withAuth";
import Chats from "./../Chats/ChatsDirectDesktop";
import ChatsMobile from "./../Chats/ChatsDirectMobile";
import AdminInformation from "../AdminInformation";
import createUserNoPP from "./../Chats/createChatUserNoProfilePic";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
  auction: state.auctionData.auction,
  recAuctions: state.auctionData.recAuctions,
});

const AuctionCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auctionID } = useParams();
  const { auction, recAuctions, currentUser } = useSelector(mapState);
  let [click, setClick] = useState(false);
  let [clicked, setClicked] = useState(false);
  const [userEmail, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [bidPrice, setBidPrice] = useState("");

  const {
    auctionThumbnail,
    auctionName,
    currentBidPrice,
    auctionDesc,
    auctionDetails,
    productAdminUserUID,
    lister,
  } = auction;

  useEffect(() => {
    dispatch(fetchAuctionStart(auctionID));
    const getData = async () => {
      try {
        const email = await getUserEmail();
        console.log(email);
        createUserNoPP(email);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    window.scroll(0, 0);
    return () => {
      dispatch(setAuction({}));
      dispatch(setRecAuctions([]));
    };
  }, [auctionID]);

  useEffect(() => {
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail)
        alert("Listing created by user, cannot contact yourself.");
      else {
        setClick(true);
      }
    }
  }, [userEmail, adminEmail]);

  const handleClose = () => {
    setClick(false);
  };

  const handleClick = async () => {
    if (!currentUser && clicked) {
      return <Redirect to="/auctions" />;
    }
    if (!currentUser && !clicked) {
      alert("Please login or register to contact lister");
      window.location = "/login";
      return;
    }
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail) {
        alert("Listing created by user, cannot contact yourself");
        return;
      }
    }
    try {
      let adminemail = await getUserEmail(productAdminUserUID);
      setAdminEmail(adminemail);
    } catch (err) {
      console.log(err);
    }
    try {
      let useremail = await getCurrUserEmail();
      setEmail(useremail);
    } catch (err) {
      console.log(err);
    }
    if (userEmail !== adminEmail) {
      setClick(true);
    }
    console.log(adminEmail);
    console.log(userEmail);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to start bidding");
      return;
    }
    if (currentUser.id === productAdminUserUID) {
      alert("Cannot bid for item listed by yourself");
      return;
    }
    if (currentUser.wallet < bidPrice * 100) {
      alert(
        "You do not have sufficient funds in your wallet, please top up to proceed with bidding"
      );
      return;
    }
    dispatch(
      bidAuctionStart({
        auctionID,
        biddetails: { userID: currentUser.id, price: bidPrice * 100 },
        auctionName,
      })
    );
    setBidPrice("");
  };

  useEffect(() => {
    console.log("fetching rec auction");
    if (auction) dispatch(fetchRecAuctions(auction));
  }, [auction]);

  if (isBrowser) {
    if (click) {
      // handleClick();
      if (!currentUser) {
        if (clicked) {
          return <Redirect to="/auctions" />;
        }
        return <Redirect to="/login" />;
      }
      return (
        <div>
          <WithAuth>
            <button id="chats-page-close" onClick={() => handleClose()}>
              x
            </button>
            <Chats
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth>
          <div className="productCard ">
            <div className="mainSection productSection">
              <div className="row w-100">
                <div className="thumbnail ">
                  <img src={auctionThumbnail} alt="No thumbnail found" />
                </div>
                <div className=" productDetails ">
                  <ul className="">
                    <div className="productTitle">
                      <li className="productName">
                        <h1>{auctionName}</h1>
                      </li>
                      <li className="auctionBid">
                        <span>
                          Current Highest Bid:{" "}
                          {currentBidPrice > 0 ? (
                            <strong>${currentBidPrice / 100}</strong>
                          ) : (
                            <strong>No bids yet</strong>
                          )}
                        </span>
                      </li>
                    </div>
                    <li className="productInfo">
                      {/* <span
                    className="desc"
                    // dangerouslySetInnerHTML={{ _html: productDesc }}
                  /> */}

                      <p>
                        {auctionDesc === ""
                          ? "No description given"
                          : auctionDesc}
                      </p>
                    </li>

                    <li className="bidding">
                      <div>
                        <div>
                          <form onSubmit={(e) => handleSubmitBid(e)}>
                            <input
                              type="number"
                              min={
                                currentBidPrice === 0
                                  ? 0.01
                                  : currentBidPrice / 100
                              }
                              max="10000.00"
                              step="0.01"
                              placeholder="Enter Bid Amount(In SGD)"
                              value={bidPrice}
                              required
                              onChange={(e) => {
                                setBidPrice(e.target.value);
                              }}
                            ></input>
                            <Button>Bid now</Button>
                          </form>
                          <p className="explanation">
                            *Bidding can only be done using wallet funds
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Lister Details</h1>
                <AdminInformation {...lister} />
                <Button onClick={() => handleClick()}>Contact Lister</Button>
              </div>
              <div className="product-detail-section">
                <h1>Specification/Details</h1>
                {auctionDetails === "" ? (
                  <span className="productdetails">
                    <p>No details given</p>
                  </span>
                ) : (
                  <span
                    className="productdetails"
                    dangerouslySetInnerHTML={{ __html: auctionDetails }}
                  ></span>
                )}
              </div>
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recAuctions.map((auction, pos) => {
                  const { auctionThumbnail, auctionName, currentBidPrice } =
                    auction;
                  console.log(auction);
                  if (
                    !auctionThumbnail ||
                    !auctionName ||
                    typeof currentBidPrice === "undefined"
                  )
                    return null;
                  const { auctionID } = auction;
                  const configAuction = {
                    documentID: auctionID,
                    ...auction,
                  };
                  return <Auction key={pos} {...configAuction} />;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!click) {
      return (
        <div>
          {currentUser ? (
            <button id="chatsButton" onClick={() => handleClick()}>
              Chats
            </button>
          ) : (
            <div />
          )}
          <div className="productCard ">
            <div className="mainSection productSection">
              <div className="row w-100">
                <div className="thumbnail ">
                  <img src={auctionThumbnail} alt="No thumbnail found" />
                </div>
                <div className=" productDetails ">
                  <ul className="">
                    <div className="productTitle">
                      <li className="productName">
                        <h1>{auctionName}</h1>
                      </li>
                      <li className="auctionBid">
                        <span>
                          Current Highest Bid:{" "}
                          {currentBidPrice > 0 ? (
                            <strong>${currentBidPrice / 100}</strong>
                          ) : (
                            <strong>No bids yet</strong>
                          )}
                        </span>
                      </li>
                    </div>
                    <li className="productInfo">
                      {/* <span
                    className="desc"
                    // dangerouslySetInnerHTML={{ _html: productDesc }}
                  /> */}

                      <p>
                        {auctionDesc === ""
                          ? "No description given"
                          : auctionDesc}
                      </p>
                    </li>

                    <li className="bidding">
                      <div>
                        <form onSubmit={(e) => handleSubmitBid(e)}>
                          <input
                            type="number"
                            min={
                              currentBidPrice === 0
                                ? 0.01
                                : currentBidPrice / 100
                            }
                            max="10000.00"
                            step="0.01"
                            placeholder="Enter Bid Amount(In SGD)"
                            value={bidPrice}
                            required
                            onChange={(e) => {
                              setBidPrice(e.target.value);
                            }}
                          ></input>
                          <Button>Bid now</Button>
                        </form>
                        <p className="explanation">
                          *Bidding can only be done using wallet funds
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Lister Details</h1>
                <AdminInformation {...lister} />
                <Button onClick={() => handleClick()}>Contact Lister</Button>
              </div>
              <div className="product-detail-section">
                <h1>Specification/Details</h1>
                {auctionDetails === "" ? (
                  <span className="productdetails">
                    <p>No details given</p>
                  </span>
                ) : (
                  <span
                    className="productdetails"
                    dangerouslySetInnerHTML={{ __html: auctionDetails }}
                  ></span>
                )}
              </div>
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recAuctions.map((auction, pos) => {
                  const { auctionThumbnail, auctionName, currentBidPrice } =
                    auction;
                  if (
                    !auctionThumbnail ||
                    !auctionName ||
                    typeof currentBidPrice === "undefined"
                  )
                    return null;
                  const { auctionID } = auction;
                  const configAuction = {
                    documentID: auctionID,
                    ...auction,
                  };
                  return <Auction key={pos} {...configAuction} />;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else if (isMobile) {
    if (click) {
      // handleClick();
      if (!currentUser) {
        if (clicked) {
          return <Redirect to="/requests" />;
        }
        return <Redirect to="/login" />;
      }
      return (
        <div>
          <WithAuth>
            <button id="chats-page-close-mobile" onClick={() => handleClose()}>
              Close
            </button>
            <ChatsMobile
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth>
        </div>
      );
    } else if (!click) {
      return (
        <div>
          {currentUser ? (
            <button id="chatsButton" onClick={() => handleClick()}>
              Chats
            </button>
          ) : (
            <div />
          )}
          <div className="productCard ">
            <div className="mainSection productSection">
              <div className="row w-100">
                <div className="thumbnail ">
                  <img src={auctionThumbnail} alt="No thumbnail found" />
                </div>
                <div className=" productDetails ">
                  <ul className="">
                    <div className="productTitle">
                      <li className="productName">
                        <h1>{auctionName}</h1>
                      </li>
                      <li className="auctionBid">
                        <span>
                          Current Highest Bid:{" "}
                          {currentBidPrice > 0 ? (
                            <strong>${currentBidPrice / 100}</strong>
                          ) : (
                            <strong>No bids yet</strong>
                          )}
                        </span>
                      </li>
                    </div>
                    <li className="productInfo">
                      {/* <span
                    className="desc"
                    // dangerouslySetInnerHTML={{ _html: productDesc }}
                  /> */}

                      <p>
                        {auctionDesc === ""
                          ? "No description given"
                          : auctionDesc}
                      </p>
                    </li>

                    <li className="bidding">
                      <div>
                        <div>
                          <form onSubmit={(e) => handleSubmitBid(e)}>
                            <input
                              type="number"
                              min={
                                currentBidPrice === 0
                                  ? 0.01
                                  : currentBidPrice / 100
                              }
                              max="10000.00"
                              step="0.01"
                              placeholder="Enter Bid Amount(In SGD)"
                              value={bidPrice}
                              required
                              onChange={(e) => {
                                setBidPrice(e.target.value);
                              }}
                            ></input>
                            <Button>Bid now</Button>
                          </form>
                          <p className="explanation">
                            *Bidding can only be done using wallet funds
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection productSection">
              <div className="admin-detail-section">
                <h1>Lister Details</h1>
                <AdminInformation {...lister} />
                <Button onClick={() => handleClick()}>Contact Lister</Button>
              </div>
              <div className="product-detail-section">
                <h1>Specification/Details</h1>
                {auctionDetails === "" ? (
                  <span className="productdetails">
                    <p>No details given</p>
                  </span>
                ) : (
                  <span
                    className="productdetails"
                    dangerouslySetInnerHTML={{ __html: auctionDetails }}
                  ></span>
                )}
              </div>
            </div>
            <div className="productSection recommendationSection">
              <h1>You might also like</h1>
              <div className="recList">
                {recAuctions.map((auction, pos) => {
                  const { auctionThumbnail, auctionName, currentBidPrice } =
                    auction;
                  if (
                    !auctionThumbnail ||
                    !auctionName ||
                    typeof currentBidPrice === "undefined"
                  )
                    return null;
                  const { auctionID } = auction;
                  const configAuction = {
                    documentID: auctionID,
                    ...auction,
                  };
                  return <Auction key={pos} {...configAuction} />;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default AuctionCard;
