import React from "react";
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
    img: {
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px 0px",
        height: "40px",
        minWidth: "40px",
        padding: "3px",
        width: "40px",
        transform: "scale(0)",
        animation: "$scale 0.3s ease forwards"
    },
    "@keyframes scale": {
        "100%": {
            transform: "scale(1)"
        }
    }
}));
const Image = ({user, src}) => {
    const classes = useStyles();
    return (
        <img
            style={{
                borderRadius: `${user ? "50% 50% 50% 0" : "50% 50% 0 50%"}`,
                transformOrigin: `${user ? "bottom left" : "bottom right"}`
            }}
            src={src}
            className={classes.img}
            alt="avatar"
        />
    );
};

export default Image;
