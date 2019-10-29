import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const SubmitButton = ({children, invalid, disabled, onClick}) => {
    const useStyles = makeStyles(theme => ({
        button: {
            backgroundColor: "transparent",
            border: 0,
            borderBottomRightRadius: "10px",
            boxShadow: "none",
            cursor: `${disabled ? "default" : "pointer"}`,
            fill: `${invalid ? "#E53935" : "#4a4a4a"}`,
            opacity: `${disabled && !invalid ? ".5" : "1"}`,
            outline: "none",
            padding: "14px 16px 12px 16px",
            position: "absolute",
            right: 0,
            top: 0,
            "&:before": {
                content: "",
                position: "absolute",
                width: "23px",
                height: "23px",
                borderRadius: "50%"
            },
            "&:not(:disabled):hover": {
                opacity: "0.7"
            }
        }
    }));
    const classes = useStyles();
    return (
        <button onClick={onClick} className={classes.button} disabled={disabled}>
            {children}
        </button>
    );
};

export default SubmitButton;
