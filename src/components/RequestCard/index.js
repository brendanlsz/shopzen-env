import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestStart,
  setRequest,
} from "./../../redux/Requests/requests.actions";
import Button from "./../forms/Button";
import "./styles.scss";
import Request from "./../Request";
import { getUserEmail, getCurrUserEmail } from "../../firebase/utils";
import Chats from "./../Chats/Chats";
import ChatsMobile from "./../Chats/ChatsDirectMobile";
import createUserNoPP from './../Chats/createChatUserNoProfilePic'
import  { Redirect } from 'react-router-dom'



import WithAuth from "../../hoc/withAuth";
import {isMobile, isDesktop, isBrowser} from 'react-device-detect';


const mapState = (state) => ({
  currentUser: state.user.currentUser,
  request: state.requestsData.request,
});

const RequestCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { requestID } = useParams();
  const { request, currentUser } = useSelector(mapState);
  let [click, setClick] = useState(false);
  let [clicked, setClicked] = useState(false);

  let [userEmail, setEmail] = useState("");
  let [adminEmail, setAdminEmail] = useState("");

  const {
    requestThumbnail,
    requestName,
    requestPrice,
    requestDesc,
    requestDetails,
    productAdminUserUID,
  } = request;

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

    return () => {
      dispatch(setRequest({}));
    };
  }, []);

  const handleClick = async () => {
    if (!currentUser && clicked) {
      return <Redirect to='/requests'  />;
    }
    if (!currentUser && !clicked) {
      alert("Please login or register to contact buyer");
      window.location = '/login';
      return;
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
    setClicked(true);
    setClick(true);
  };

  

  const handleClose = () => {
    setClick(false)
  }

  if (isBrowser) {
    {
      console.log("desktop");
      if (click) {
        // handleClick();
        if(!currentUser) {
          if (clicked) {
            return <Redirect to='/requests'  />;
          }
          return <Redirect to='/login'  />;
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
              <div className="requestSection recommendationSection">
                <h1>You might also like (Not Functional Yet)</h1>
                <div className="recList">
                  <Request {...request} />
                  <Request {...request} />
                  <Request {...request} />
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
          <div className="requestSection recommendationSection">
            <h1>You might also like (Not Functional Yet)</h1>
            <div className="recList">
              <Request {...request} />
              <Request {...request} />
              <Request {...request} />
            </div>
          </div>
        </div>
      );
    }
  } else if (isMobile) {
    {
      console.log("mobile");
      if (click) {
        // handleClick();
        if(!currentUser) {
          if (clicked) {
            return <Redirect to="/requests" />;
          }
          return <Redirect to="/login" />;
        } 
        return (
          <WithAuth>
            <ChatsMobile
              currentUserEmail={userEmail}
              currentUserUid={currentUser.id}
              adminUserEmail={adminEmail}
              admiUserUid={productAdminUserUID}
            />
          </WithAuth>
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
          <div className="requestSection recommendationSection">
            <h1>You might also like (Not Functional Yet)</h1>
            <div className="recList">
              <Request {...request} />
              <Request {...request} />
              <Request {...request} />
            </div>
          </div>
        </div>
      );
    }
  }
};

export default RequestCard;
