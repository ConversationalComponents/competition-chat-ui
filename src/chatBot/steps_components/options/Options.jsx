import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    ul: {
        margin: "2px 0 12px 0",
        padding: "0 6px"
    }
}));

const Options = ({children}) => {
    const classes = useStyles();
    return <ul className={classes.ul}>{children}</ul>;
};

export default Options;
