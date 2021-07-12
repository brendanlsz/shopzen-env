import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestStart,
  setRequest,
  incrementRequestView,
  fetchRecRequests,
  setRecRequests,
} from "./../../redux/Requests/requests.actions";
import Button from "./../forms/Button";
import "./styles.scss";
import Request from "./../Request";
import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";
import Chats from "./../Chats/ChatsDirectDesktop";
import ChatsSingle from "./../Chats/ChatsDirectDesktopSingle";
import ChatsMobile from "./../Chats/ChatsDirectMobileSingle";
import createUserNoPP from "./../Chats/createChatUserNoProfilePic";
import AdminInformation from "../AdminInformation";
import { Redirect } from "react-router-dom";
import WithAuth from "../../hoc/withAuth";
import { isMobile, isDesktop, isBrowser } from "react-device-detect";
import UserManageProducts from "./../../components/ManageProducts copy/index";
import Modal1 from "../Modal1";
import Modal2 from "../Modal2";




const mapState = (state) => ({
  currentUser: state.user.currentUser,
  request: state.requestsData.request,
  recRequests: state.requestsData.recRequests,
});

const RequestCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { requestID } = useParams();
  const { request, currentUser, recRequests } = useSelector(mapState);
  let [click, setClick] = useState(false);
  let [clicked, setClicked] = useState(false);

  const [userEmail, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [url, setUrl] = useState("");

  const [toggle, setToggle] = useState(true);

  const [list, setList] = useState(false);

  const [hideProductModal, setHideProductModal] = useState(true);
  const toggleProductModal = () => setHideProductModal(!hideProductModal);


  const {
    requestThumbnail,
    requestName,
    requestPrice,
    requestDesc,
    requestDetails,
    productAdminUserUID,
    lister,
  } = request;

  const configProductModal = {
    hideModal: hideProductModal,
    toggleModal: toggleProductModal,
  };

  useEffect(() => {
    dispatch(fetchRequestStart(requestID));
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
      dispatch(setRequest({}));
      dispatch(setRecRequests([]));
    };
  }, [requestID]);

  useEffect(() => {
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail)
        alert("Request created by user, cannot contact yourself");
      else {
        setClick(true);
        dispatch(incrementRequestView(requestID));
      }
    }
  }, [userEmail, adminEmail]);

  useEffect(() => {
    if (request) dispatch(fetchRecRequests(request));
  }, [request]);

  const handleClick = async () => {
    if (!currentUser && clicked) {
      return <Redirect to="/requests" />;
    }
    if (!currentUser && !clicked) {
      alert("Please login or register to contact buyer");
      window.location = "/login";
      return;
    }
    if (userEmail !== "" && adminEmail !== "") {
      if (userEmail === adminEmail) {
        alert("Request created by user, cannot contact yourself");
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
    toggleProductModal()
  };

  const handleClose = () => {
    setClick(false);
  };

  const handleList = () => {
    setList(!list);
  }

  useEffect(() => {
    console.log(url);
    setToggle(!toggle)
  }, [url])


  if (isBrowser) {
    // console.log("desktop");
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
          <div className="sendProduct">
            <Modal1 {...configProductModal}>
              <div className="sendManageProduct">
                <UserManageProducts changeUrl={url => setUrl(url)}/>
              </div>
              <ChatsSingle
                currentUserEmail={userEmail}
                currentUserUid={currentUser.id}
                adminUserEmail={adminEmail}
                admiUserUid={productAdminUserUID}
                url={url}
              />
            </Modal1>
          </div>
          {/* <WithAuth>
            <button id="chats-page-close" onClick={() => handleClose()}>
              x
            </button>
            <Chats
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth> */}
          <div className="productCard ">
            <div className="mainSection requestSection">
              <div className="row w-100">
                <div className="thumbnail ">
                  <img src={requestThumbnail} alt="No thumbnail found" />
                </div>
                <div className="requestDetails ">
                  <ul className="">
                    <div className="requestTitle">
                      <li className="requestName">
                        <h1>{requestName}</h1>
                      </li>
                      <li className="requestPrice">
                        <span>Budget: ${requestPrice}</span>
                      </li>
                    </div>
                    <li className="requestInfo">
                      {/* <span
                  className="desc"
                  // dangerouslySetInnerHTML={{ _html: productDesc }}
                /> */}
                      <p>
                        {requestDesc === ""
                          ? "No description given"
                          : requestDesc}
                      </p>
                    </li>
                    <li>
                      <Button onClick={() => handleClick()}>
                        Contact Buyer
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="detailsSection requestSection">
              <div className="admin-detail-section">
                <h1>Buyer Details</h1>
                <AdminInformation {...lister} />
              </div>
              <div className="request-detail-section">
                <h1>Specification/Details</h1>
                {requestDetails === "" ? (
                  <span className="requestdetails">
                    <p>No details given</p>
                  </span>
                ) : (
                  <span
                    className="requestdetails"
                    dangerouslySetInnerHTML={{ __html: requestDetails }}
                  ></span>
                )}
              </div>
            </div>
            <div className="requestSection recommendationSection">
              <h1>You might like</h1>
              <div className="recList">
                {recRequests.map((request, pos) => {
                  const { requestThumbnail, requestName, requestPrice } =
                    request;
                  if (
                    !requestThumbnail ||
                    !requestName ||
                    typeof requestPrice === "undefined"
                  )
                    return null;
                  const { requestID } = request;
                  const configRequest = {
                    documentID: requestID,
                    ...request,
                  };
                  return <Request key={pos} {...configRequest} />;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!click)
      return (
        <div className="productCard ">
          <div className="mainSection requestSection">
            <div className="row w-100">
              <div className="thumbnail ">
                <img src={requestThumbnail} alt="No thumbnail found" />
              </div>
              <div className="requestDetails ">
                <ul className="">
                  <div className="requestTitle">
                    <li className="requestName">
                      <h1>{requestName}</h1>
                    </li>
                    <li className="requestPrice">
                      <span>Budget: ${requestPrice}</span>
                    </li>
                  </div>
                  <li className="requestInfo">
                    {/* <span
                  className="desc"
                  // dangerouslySetInnerHTML={{ _html: productDesc }}
                /> */}
                    <p>
                      {requestDesc === ""
                        ? "No description given"
                        : requestDesc}
                    </p>
                  </li>
                  <li>
                    <Button onClick={() => handleClick()}>Contact Buyer</Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="detailsSection requestSection">
            <div className="admin-detail-section">
              <h1>Buyer Details</h1>
              <AdminInformation {...lister} />
            </div>
            <div className="request-detail-section">
              <h1>Specification/Details</h1>
              {requestDetails === "" ? (
                <span className="requestdetails">
                  <p>No details given</p>
                </span>
              ) : (
                <span
                  className="requestdetails"
                  dangerouslySetInnerHTML={{ __html: requestDetails }}
                ></span>
              )}
            </div>
          </div>
          <div className="requestSection recommendationSection">
            <h1>You might like</h1>
            <div className="recList">
              {recRequests.map((request, pos) => {
                const { requestThumbnail, requestName, requestPrice } = request;
                if (
                  !requestThumbnail ||
                  !requestName ||
                  typeof requestPrice === "undefined"
                )
                  return null;
                const { requestID } = request;
                const configRequest = {
                  documentID: requestID,
                  ...request,
                };
                return <Request key={pos} {...configRequest} />;
              })}
            </div>
          </div>
        </div>
      );
  } else if (isMobile) {
    // console.log("mobile");
    if (click) {
      // handleClick();
      if (!currentUser) {
        if (clicked) {
          return <Redirect to="/requests" />;
        }
        return <Redirect to="/login" />;
      }
      return (
        <WithAuth>
          <button id="chats-page-close-mobile" onClick={() => handleClose()}>
            Close
          </button>
          <button id="chats-page-list-mobile" onClick={() => handleClick()}>
            <p>Item</p>
            <p>List</p>
          </button>
          <ChatsMobile
            currentUserEmail={userEmail}
            currentUserUid={currentUser.id}
            adminUserEmail={adminEmail}
            admiUserUid={productAdminUserUID}
            url={url}
          />
          <Modal2 {...configProductModal}>
            <UserManageProducts changeUrl={(url) => setUrl(url)} />
          </Modal2>
        </WithAuth>
      );
    } else if (!click)
      return (
        <div className="productCard ">
          {currentUser ? (
            <button id="chatsButton" onClick={() => handleClick()}>
              Chats
            </button>
          ) : (
            <div />
          )}
          <div className="mainSection requestSection">
            <div className="row w-100">
              <div className="thumbnail ">
                <img src={requestThumbnail} alt="No thumbnail found" />
              </div>
              <div className="requestDetails ">
                <ul className="">
                  <div className="requestTitle">
                    <li className="requestName">
                      <h1>{requestName}</h1>
                    </li>
                    <li className="requestPrice">
                      <span>Budget: ${requestPrice}</span>
                    </li>
                  </div>
                  <li className="requestInfo">
                    {/* <span
                    className="desc"
                    // dangerouslySetInnerHTML={{ _html: productDesc }}
                  /> */}
                    <p>
                      {requestDesc === ""
                        ? "No description given"
                        : requestDesc}
                    </p>
                  </li>
                  <li>
                    <Button onClick={() => handleClick()}>Contact Buyer</Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="detailsSection requestSection">
            <div className="admin-detail-section">
              <h1>Buyer Details</h1>
              <AdminInformation {...lister} />
            </div>
            <div className="request-detail-section">
              <h1>Specification/Details</h1>
              {requestDetails === "" ? (
                <span className="requestdetails">
                  <p>No details given</p>
                </span>
              ) : (
                <span
                  className="requestdetails"
                  dangerouslySetInnerHTML={{ __html: requestDetails }}
                ></span>
              )}
            </div>
          </div>
          <div className="requestSection recommendationSection">
            <h1>You might like</h1>
            <div className="recList">
              {recRequests.map((request, pos) => {
                const { requestThumbnail, requestName, requestPrice } = request;
                if (
                  !requestThumbnail ||
                  !requestName ||
                  typeof requestPrice === "undefined"
                )
                  return null;
                const { requestID } = request;
                const configRequest = {
                  documentID: requestID,
                  ...request,
                };
                return <Request key={pos} {...configRequest} />;
              })}
            </div>
          </div>
        </div>
      );
  }
};

export default RequestCard;
