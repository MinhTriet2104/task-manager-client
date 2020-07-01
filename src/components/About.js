import React, { Component } from "react";
import Header from "./common/Header";

class About extends Component {
  render() {
    return (
      <div>
        <Header />

        <aside className="container">
          <div className="col-sm aboutUs">
            <h2 className="mcell-title story">Abous Us</h2>
            <div className="padding20">@mrecoder</div>
          </div>
        </aside>
      </div>
    );
  }
}
export default About;
