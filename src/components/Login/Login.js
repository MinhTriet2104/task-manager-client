import React from "react";
import styled from "styled-components";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import "../../styles/Login.scss";

const LoginContainer = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.div`
  height: 500px;
  width: 600px;

  display: flex;

  background: #fff;
  box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.12);

  border-radius: 4px;
`;

const LeftSection = styled.div`
  width: 40%;

  background-image: url("https://i.pinimg.com/564x/3c/e5/f6/3ce5f6f5ee9dba8cfb2445cbe94eae10.jpg");
  background-size: cover;
  background-position: center;
`;

const RightSection = styled.div`
  width: 60%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: bolder;
  line-height: 4rem;
`;

const Login = () => {
  const responseFacebook = (response) => {
    console.log(response);
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <LeftSection></LeftSection>
        <RightSection>
          <LoginTitle>Login With</LoginTitle>
          <FacebookLogin
            appId="661692841097516"
            textButton="FACEBOOK"
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="fb-login-btn"
            icon="fa-facebook"
          />

          <GoogleLogin
            clientId="738277559607-qmkk4k8rared9tltub646d02oq8bvkuf.apps.googleusercontent.com"
            buttonText="GOOGLE"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className="gg-login-btn"
          />
        </RightSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
