import React, { useState, useEffect } from "react";
import Loading from "./chatBot/steps_components/common/Loading";

const axios = require("axios");

const BotTextResponse = ({ previousStep, triggerNextStep, requestURL }) => {
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (res) {
      triggerNextStep({
        trigger: "get_user_input"
      });
    }
  }, [res, triggerNextStep]);

  useEffect(() => {
    if (previousStep) {
      const text = previousStep.message;
      axios
        .post(requestURL, {
          user_input: text
        })
        .then(function(response) {
          setRes({ ...response.data });
        })
        .catch(function(error) {
          setRes({ response: "Failure!" });
          console.log("error", error);
        });
    }
  }, [previousStep, requestURL]);

  return <div>{res ? res.response : <Loading />}</div>;
};

export default BotTextResponse;
