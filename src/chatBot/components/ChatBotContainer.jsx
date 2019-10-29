import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const ChatBotContainer = ({ children, width, height }) => {
  const useStyles = makeStyles(theme => ({
    div: {
      backgroundColor: "#f5f8fb",
      borderRadius: "10px",
      boxShadow: "0 12px 24px 0 rgba(0, 0, 0, 0.15)",
      fontFamily: "sans-serif",
      overflow: "hidden",
      position: "relative",
      bottom: "initial",
      top: "initial",
      right: "initial",
      left: "initial",
      zIndex: "999",
      transform: "scale(1)",
      transformOrigin: "bottom right",
      transition: "transform 0.3s ease",
      height: height,
      width: width,
      maxWidth: width,
      minWidth: width,

      [theme.breakpoints.down("sm")]: {
        borderRadius: "",
        bottom: "0 !important",
        left: "initial !important",
        height: "100%",
        right: "0 !important",
        top: "initial !important",
        width: "100%"
      }
    }
  }));

  const classes = useStyles();
  return <div className={classes.div}>{children}</div>;
};

export default ChatBotContainer;
