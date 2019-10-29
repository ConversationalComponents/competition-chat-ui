import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const ImageContainer = ({ children, user }) => {
  const useStyles = makeStyles(theme => ({
    div: {
      display: "inline-block",
      order: `${user ? "1" : "0"}`,
      padding: "6px",
      paddingBottom: "10px"
    }
  }));
  const classes = useStyles();
  return <div className={classes.div}>{children}</div>;
};

export default ImageContainer;
