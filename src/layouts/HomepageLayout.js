import React from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

const HomepageLayout = (props) => {
  return (
    <div className="fullHeight">
      <Header {...props} />
      <div className="fullHeight">{props.children}</div>
      <Footer />
    </div>
  );
};

export default HomepageLayout;
