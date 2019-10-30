import React, { useEffect, useState } from "react";
import ChatBot from "./chatBot/ChatBot";
import BotTextResponse from "./botTextResponse";
import "./App.css";

const App = () => {
  const [steps, setSteps] = useState([]);
  const [config] = useState(window.Config);

  useEffect(() => {
    setSteps([
      {
        id: "welcome",
        message: config.firstMessage,
        trigger: "get_user_input"
      },
      {
        id: "get_user_input",
        user: true,
        trigger: "custom"
      },
      {
        id: "custom",
        component: <BotTextResponse requestURL={config.requestURL} />,
        waitAction: true,
        asMessage: true
      }
    ]);
  }, []);

  return (
    <div className="App">
      {steps.length > 0 && (
        <ChatBot
          headerComponent={<div className="header">CoCo</div>}
          steps={steps}
        />
      )}
    </div>
  );
};

export default App;
