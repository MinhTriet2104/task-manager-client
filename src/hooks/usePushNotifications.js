import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import * as serviceWorker from "../serviceWorker";

const pushNotificationSupported = serviceWorker.isPushNotificationSupported();
// check push notifications are supported by the browser

export default function usePushNotifications() {
  const user = useSelector((state) => state.user);

  const [userConsent, setSuserConsent] = useState(Notification.permission);
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState(null);
  //to manage the use push notification subscription
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  //to manage the push server subscription
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions

  const isConsentGranted = userConsent === "granted";

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      serviceWorker.register();
    }
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render

  useEffect(() => {
    if (pushNotificationSupported && !isConsentGranted) {
      onClickAskUserPermission();
    } else {
      console.log("permisson granted");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await serviceWorker.getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);

  useEffect(() => {
    if (isConsentGranted && !userSubscription) {
      onClickSusbribeToPushNotification();
    }
  }, [userConsent, userSubscription]);

  useEffect(() => {
    if (isConsentGranted && userSubscription && !pushServerSubscriptionId) {
      onClickSendSubscriptionToPushServer();
    }
  }, [userSubscription, pushServerSubscriptionId]);
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    serviceWorker.askUserPermission().then((consent) => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0,
        });
      }
      setLoading(false);
    });
  };
  //

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  const onClickSusbribeToPushNotification = () => {
    console.log("onClickSusbribeToPushNotification");
    setLoading(true);
    setError(false);
    serviceWorker
      .createNotificationSubscription()
      .then(function (subscrition) {
        console.log(subscrition);
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "Couldn't create the notification subscription",
          err,
          "name:",
          err.name,
          "message:",
          err.message,
          "code:",
          err.code
        );
        setError(err);
        setLoading(false);
      });
  };

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSendSubscriptionToPushServer = () => {
    setLoading(true);
    setError(false);
    console.log(userSubscription);
    axios
      .post("http://localhost:2104/subscription", {
        userId: user.id,
        data: userSubscription,
      })
      .then(function (response) {
        setPushServerSubscriptionId(response.data.id);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  /**
   * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendNotification = async () => {
    setLoading(true);
    setError(false);
    console.log(pushServerSubscriptionId);
    axios
      .get(`http://localhost:2104/subscription/${pushServerSubscriptionId}`)
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
    setLoading(false);
  };

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading,
  };
}
