import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const TextStepContainer = ({user, children}) => {
    const useStyles = makeStyles(theme => ({
        div: {
            alignItems: "flex-end",
            display: "flex",
            justifyContent: `${user ? "flex-end" : "flex-start"}`
        }
    }));
    const classes = useStyles();
    return <div className={classes.div}>{children}</div>;
};

export default TextStepContainer;
