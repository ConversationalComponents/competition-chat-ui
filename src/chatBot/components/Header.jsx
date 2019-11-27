import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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
      <img
        style={{ paddingLeft: "7px" }}
        src={process.env.PUBLIC_URL + "/images/logoNew.png"}
        height="35"
        alt="logo"
      />
    </div>
  );
};

export default Header;
