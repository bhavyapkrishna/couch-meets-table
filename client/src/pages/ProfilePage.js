import React from "react";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  return(
    <div className="container-fluid custom-bg vh-100 d-flex flex-column justify-content-start pt-5">
      <Navbar />
      <div className="card p-4 text-center mt-5 border-0 custom-bg">
        <h1 className="h3 custom-txt">Log In</h1>
      </div>
    </div>
  );
};

export default ProfilePage;