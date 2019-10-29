import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    footer: {
        position: "relative"
    }
}));

const Footer = ({children}) => {
    const classes = useStyles();
    return <div className={classes.footer}>{children}</div>;
};

export default Footer;
