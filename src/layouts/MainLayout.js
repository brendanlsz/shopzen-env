import React from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import ChatsWrapper from "./ChatsWrapper";


const MainLayout = props => {
  return (
    <div>
      <Header {...props} />
      <div className="main">
        {props.children}
      </div>
      <ChatsWrapper></ChatsWrapper>
      <Footer />
    </div>
  );
};

export default MainLayout;
