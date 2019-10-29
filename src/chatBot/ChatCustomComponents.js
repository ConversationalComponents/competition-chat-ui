import React, { useState, useEffect, useContext, useRef } from "react";
import Loading from "./steps_components/common/Loading";
import Box from "@material-ui/core/Box";
import { CompetitionContext } from "../../contexts/context";
import { Modal, Button } from "react-bootstrap";
import ReactJson from "react-json-view";
import { Popover, Overlay, ButtonToolbar } from "react-bootstrap";
const axios = require("axios");

export const BotTextResponse = ({
  previousStep,
  sessionId,
  triggerNextStep,
  setSuccess,
  setFailed,
  componentId
}) => {
  const { name } = useContext(CompetitionContext);
  const [res, setRes] = useState(null);
  const inputEl = useRef(null);

  useEffect(() => {
    if (res) {
      triggerNextStep({
        trigger: "json",
        value: { res, width: inputEl.current.offsetWidth }
      });
    }
  }, [res, triggerNextStep]);

  useEffect(() => {
    if (previousStep) {
      const text = previousStep.message;
      axios
        .post(
          `https://app.coco.imperson.com/api/exchange/${componentId}/${sessionId}`,
          {
            user_input: text,
            context: { "user.firstName": name }
          }
        )
        .then(function(response) {
          if (response.data.component_failed) {
            setRes({ ...response.data });
            setFailed(true);
          } else {
            if (response.data.component_done) {
              setRes({ ...response.data });
              setSuccess(true);
            } else {
              setRes({ ...response.data });
            }
          }
        })
        .catch(function(error) {
          setRes({ response: "Failure!" });
          setFailed(true);
          console.log("error", error);
        });
    }
  }, [previousStep]);

  return <div ref={inputEl}>{res ? res.response : <Loading />}</div>;
};

export const Params = ({ steps, triggerNextStep }) => {
  const [params, setParams] = useState(null);
  const { setName } = useContext(CompetitionContext);

  useEffect(() => {
    if (steps.json.value.updated_context) {
      setParams(steps.json.value.updated_context);
    }
  }, []);

  useEffect(() => {
    if (params) {
      triggerNextStep({ trigger: "get_user_input" });
    }
  }, [params]);

  const printParams = params => {
    let myParams = [];
    Object.keys(params).forEach(function(item) {
      if (typeof params[item] === "object") {
        const insideObj = params[item];
        Object.keys(insideObj).forEach(function(obj) {
          if (obj === "firstName") {
            setName(insideObj[obj]);
          }
          myParams.push(
            <p key={`${item}.${obj}`} style={{ margin: 0, padding: 0 }}>
              <span style={{ color: "#9c27b0" }}>
                {item}.{obj}:
              </span>{" "}
              <span style={{ color: "#01A6E0" }}>{insideObj[obj]}</span>
            </p>
          );
        });
      } else {
        myParams.push(
          <p key={item} style={{ margin: 0, padding: 0 }}>
            <span style={{ color: "#9c27b0" }}>{item}:</span>{" "}
            <span style={{ color: "#01A6E0" }}>{params[item]}</span>
          </p>
        );
      }
    });
    return myParams;
  };

  return (
    <Box>
      {params ? (
        <div style={{ marginTop: "-12px", padding: 0 }}>
          {printParams(params)}
        </div>
      ) : (
        <Loading />
      )}
    </Box>
  );
};

export const JsonView = ({ steps, triggerNextStep, modalSm }) => {
  const [json, setJson] = useState(null);
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = event => {
    setShow(!show);
    setTarget(event.target);
  };

  useEffect(() => {
    if (steps.custom.value) {
      setWidth(steps.custom.value.width + 17);
      setJson(steps.custom.value.res);
    }
  }, []);

  useEffect(() => {
    if (json) {
      let isObjEmpty = false;
      if (steps.custom.value.res.updated_context) {
        isObjEmpty =
          Object.entries(steps.custom.value.res.updated_context).length === 0 &&
          steps.custom.value.res.updated_context.constructor === Object;
      }
      if (steps.custom.value.res.component_done) {
        if (!isObjEmpty) {
          triggerNextStep({
            trigger: "params",
            value: steps.custom.value.res
          });
        }
      } else {
        if (isObjEmpty) {
          triggerNextStep({ trigger: "get_user_input" });
        } else {
          triggerNextStep({
            trigger: "params",
            value: steps.custom.value.res
          });
        }
      }
    }
  }, [json]);

  return (
    <React.Fragment>
      <ButtonToolbar ref={ref}>
        <button
          onClick={handleClick}
          type="button"
          data-container="body"
          data-toggle="popover"
          data-placement="right"
          data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
          className="d-flex btn justify-content-center align-items-center json-custom-component"
          style={{
            height: "27px",
            width: "27px",
            marginLeft: width,
            marginTop: "-31px",
            backgroundColor: "#9c27b0",
            borderRadius: "50%",
            cursor: "pointer"
          }}
        >
          <i style={{ fontSize: "12px" }} className="fas fa-code text-light" />
        </button>

        <Overlay
          show={show}
          target={target}
          placement="top-end"
          container={ref.current}
          containerPadding={20}
          rootClose={true}
        >
          <Popover id="popover-contained">
            <Popover.Title as="h3">
              <div className="d-flex justify-content-between align-items-center">
                <span>Json response</span>
                <span
                  onClick={handleClick}
                  class="close"
                  aria-label="Close"
                  style={{ cursor: "pointer" }}
                >
                  <span aria-hidden="true">&times;</span>
                </span>
              </div>
            </Popover.Title>
            <Popover.Content>
              {json && (
                <ReactJson
                  style={{ maxHeight: "270px", overflowY: "scroll" }}
                  src={json}
                  name={false}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              )}
              <button
                onClick={handleClick}
                className="btn btn-secondary btn-sm btn-block mt-3"
              >
                Close
              </button>
            </Popover.Content>
          </Popover>
        </Overlay>
      </ButtonToolbar>

      {/* <button
        type="button"
        data-container="body"
        data-toggle="popover"
        data-placement="right"
        data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
        onClick={handleShow}
        className="d-flex btn justify-content-center align-items-center json-custom-component"
        style={{
          height: "27px",
          width: "27px",
          marginLeft: width,
          marginTop: "-37px",
          backgroundColor: "#9c27b0",
          borderRadius: "50%",
          cursor: "pointer"
        }}
      >
        <i style={{ fontSize: "12px" }} className="fas fa-code text-light" />
      </button> */}

      {/* <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={modalSm ? "modal-sm" : ""}
      >
        <Modal.Header closeButton>
          <Modal.Title>Json response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {json && (
            <ReactJson
              src={json}
              name={false}
              enableClipboard={false}
              displayDataTypes={false}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </React.Fragment>
  );
};
