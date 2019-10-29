import React from "react";
import ChatBot from "./chatBot/ChatBot";
import BotTextResponse from "./botTextResponse";
import "./App.css";
import { requestURL, firstMessage } from "./config/params";

const App = () => {
  const steps = [
    {
      id: "welcome",
      message: firstMessage,
      trigger: "get_user_input"
    },
    {
      id: "get_user_input",
      user: true,
      trigger: "custom"
    },
    {
      id: "custom",
      component: <BotTextResponse requestURL={requestURL} />,
      waitAction: true,
      asMessage: true
    }
  ];
  return (
    <div className="App">
      <ChatBot
        headerComponent={<div className="header">CoCo</div>}
        steps={steps}
      />
    </div>
  );
};

export default App;
