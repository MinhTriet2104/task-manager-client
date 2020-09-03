import React from "react";
import styled from "styled-components";

import LandingSvg from "../images/landing_svg.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  height: calc(100vh - 57px);
  width: 100%;

  padding-top: 30px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;

  line-height: 2.4rem;
`;

const MainSection = () => {
  return (
    <>
      <header style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, .10)" }}>
        <div className="mainMenu"></div>
        <div className="profilewidget">
          <i
            style={{ fontSize: 35, color: "#888", cursor: "pointer" }}
            class="fas fa-sign-out-alt"
          ></i>
        </div>
      </header>
      <Container>
        <Title>Select Your Project</Title>
        <Title>Or Create New One</Title>
        <img width={800} src={LandingSvg} />
      </Container>
    </>
  );
};

export default MainSection;
