import React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const Login = () => {
  const responseFacebook = (response) => {
    console.log(response);
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <div>
      <FacebookLogin
        appId="661692841097516"
        fields="name,email,picture"
        callback={responseFacebook}
      />

      <br />
      <br />

      <GoogleLogin
        clientId="738277559607-qmkk4k8rared9tltub646d02oq8bvkuf.apps.googleusercontent.com"
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
};

export default Login;
