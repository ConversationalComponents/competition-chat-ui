import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../icons/logo.png";

const useStyles = makeStyles(theme => ({
  header: {
    alignItems: "center",
    backgroundColor: "#01a6e0",
    color: "#fff",
    display: "flex",
    fill: "#fff",
    height: "56px"
  },
  title: {
    fontSize: "17px"
  }
}));

const Header = ({ headerTitle }) => {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <img src={Logo} alt="Smiley face" height="37"></img>
    </div>
  );
};

export default Header;
