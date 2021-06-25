import React from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ChatsWrapper from "./ChatsWrapper";

const HomepageLayout = (props) => {
  return (
    <div className="fullHeight">
        <Header {...props} />
        <div>{props.children}</div>
        <Footer />
        <ChatsWrapper></ChatsWrapper>
    </div>
  );
};

export default HomepageLayout;
