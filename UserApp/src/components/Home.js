import React from "react";
import UserInfo from "./UserInfo";

function Home() {
  return (
    <div>
      <div className="HomeHeader">
        <h1>Welcome Users</h1>
      </div>
      <UserInfo />
      <footer>
        <p className="footerText">Created by Shambhavi Awasthi</p>
      </footer>
    </div>
  );
}
export default Home;
