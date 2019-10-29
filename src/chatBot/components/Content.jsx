import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const Content = ({ children, height, onNodeInserted, showParams }) => {
  const conteiner = useRef(null);
  const useStyles = makeStyles(theme => ({
    div: {
      height: `calc(${height} - 112px)`,
      overflowY: "scroll",
      marginTop: "2px",
      paddingTop: "6px"
    }
  }));
  const classes = useStyles();

  useEffect(() => {
    conteiner.current.addEventListener("DOMNodeInserted", onNodeInserted);
    return () => {
      conteiner.current.removeEventListener("DOMNodeInserted", onNodeInserted);
    };
  }, []);

  useEffect(() => {
    conteiner.current.scrollTop = conteiner.current.scrollHeight;
  }, [showParams]);

  return (
    <div ref={conteiner} className={classes.div}>
      {children}
    </div>
  );
};

export default Content;
