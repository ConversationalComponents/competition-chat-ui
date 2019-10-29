import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    div: {
        delay: "flex",
        marginTop: "-7px",
        marginBottom: "7px",
        paddingTop: 0,
        paddingBottom: "7px",
        paddingLeft: "57px",
        justifyContent: "start",
        fontSize: "11px",
        backgroundColor: "inherit"
    }
}));

const ChatStepContainer = ({children, showParams}) => {
    const classes = useStyles();
    return (
        <div style={{display: `${showParams ? "block" : "none"}`}} className={classes.div}>
            {children}
        </div>
    );
};

export default ChatStepContainer;
