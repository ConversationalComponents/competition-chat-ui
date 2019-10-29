import React from "react";
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
    button: {
        backgroundColor: "#01a6e0",
        border: 0,
        borderRadius: "22px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.15)",
        color: "#fff",
        display: "inline-block",
        fontSize: "14px",
        padding: "12px",
        "&:hover": {
            opacity: "0.7"
        },
        "&:active": {
            outline: "none"
        },
        "&:hover:focus": {
            outline: "none"
        }
    }
}));

const OptionElement = ({children}) => {
    const classes = useStyles();
    return <button className={classes.button}>{children}</button>;
};

export default OptionElement;
