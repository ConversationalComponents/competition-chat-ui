import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    li: {
        animation: "$scale 0.3s ease forwards",
        cursor: "pointer",
        display: "inline-block",
        margin: "2px",
        transform: "scale(0)"
    },
    "@keyframes scale": {
        "100%": {transform: "scale(1)"}
    }
}));

const Option = ({children}) => {
    const classes = useStyles();
    return <li className={classes.li}>{children}</li>;
};

export default Option;
