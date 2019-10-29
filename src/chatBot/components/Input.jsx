import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const Input = ({
  inputInvalid,
  inputPlaceholder,
  onKeyPress,
  onChange,
  disabled,
  value,
  renderedSteps,
  windowWidth
}) => {
  const inputRef = useRef(null);
  const useStyles = makeStyles(theme => {
    return {
      input: {
        border: 0,
        borderRadius: 0,
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        borderTop: "1px solid #eee",
        boxShadow: "none",
        boxSizing: "border-box",
        fontSize: "16px",
        opacity: `${disabled && !inputInvalid ? ".5" : "1"}`,
        outline: "none",
        padding: "16px 10px",
        width: "100%",
        "-webkit-appearance": "none",
        "&:disabled": {
          background: "#fff"
        }
      }
    };
  });

  useEffect(() => {
    if (!disabled && renderedSteps.length > 2) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [disabled, renderedSteps.length]);

  const classes = useStyles();
  return (
    <input
      className={classes.input}
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      type="textarea"
      disabled={disabled}
      placeholder={inputInvalid ? "" : inputPlaceholder}
    />
  );
};

export default Input;
