import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const LoadingStep = ({children, delay}) => {
    const useStyles = makeStyles(theme => ({
        span: {
            animation: "$loading 1.4s infinite both",
            animationDelay: `${delay}`
        },
        "@keyframes loading": {
            "0%": {opacity: ".2"},
            "20%": {opacity: "1"},
            "100%": {opacity: ".2"}
        }
    }));
    const classes = useStyles();
    return <span className={classes.span}>{children}</span>;
};

export default LoadingStep;
