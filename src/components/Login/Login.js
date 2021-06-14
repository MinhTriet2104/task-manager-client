import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";

import "../../styles/Login.scss";

import GoogleIcon from "../../images/google_icon.svg";
import FacebookIcon from "../../images/facebook_icon.svg";

import { createUserRequest, setUser } from "../../actions";

const LoginContainer = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.div`
  height: 500px;
  width: 650px;

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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const history = useHistory();

  if (user) {
    history.replace("/project");
  }

  const responseFacebook = async (res) => {
    console.log("res:", res);
    const id = res.id;
    if (id) {
      const req = await axios.get(`http://localhost:2104/user/${id}`);

      const user = {
        oauth2Id: id,
        username: res.name,
        email: res.email,
        avatar: res.picture.data.url,
      };

      if (!req.data) dispatch(createUserRequest(user));
      else dispatch(setUser(req.data));

      // history.replace("/project");
      history.push("/project");
    }
  };

  const responseGoogle = async (res) => {
    console.log(res);
    const id = res.googleId;
    if (id) {
      const req = await axios.get(`http://localhost:2104/user/${id}/login`);

      const user = {
        oauth2Id: id,
        username: res.profileObj.name,
        email: res.profileObj.email,
        avatar: res.profileObj.imageUrl,
      };

      console.log(req.data);

      if (!req.data) dispatch(createUserRequest(user));
      else dispatch(setUser(req.data));

      // history.replace("/project");
      history.push("/project");
    }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <LeftSection></LeftSection>
        <RightSection>
          <LoginTitle>Login With</LoginTitle>
          {/* <FacebookLogin
            appId="661692841097516"
            textButton="FACEBOOK"
            fields="name,email,picture"
            callback={responseFacebook}
            render={(renderProps) => (
              <button onClick={renderProps.onClick} className="gg-login-btn">
                <span
                  className="icon"
                  style={{
                    backgroundImage: `url(${FacebookIcon})`,
                  }}
                ></span>
                <span className="text">Facebook</span>
              </button>
            )}
          /> */}

          <GoogleLogin
            clientId="738277559607-qmkk4k8rared9tltub646d02oq8bvkuf.apps.googleusercontent.com"
            buttonText="GOOGLE"
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="gg-login-btn"
              >
                <span
                  className="icon"
                  style={{
                    backgroundImage: `url(${GoogleIcon})`,
                  }}
                ></span>
                <span className="text">Google</span>
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </RightSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;
