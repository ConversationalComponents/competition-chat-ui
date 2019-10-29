import React, { Component } from "react";
import PropTypes from "prop-types";
import Bubble from "./Bubble";
import Image from "./Image";
import ImageContainer from "./ImageContainer";
import Loading from "../common/Loading";
import TextStepContainer from "./TextStepContainer";

class TextStep extends Component {
  /* istanbul ignore next */
  state = {
    loading: true
  };

  componentDidMount() {
    const { step, triggerNextStep } = this.props;
    const { component, delay, waitAction } = step;
    const isComponentWatingUser = component && waitAction;

    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!isComponentWatingUser && !step.rendered) {
          triggerNextStep();
        }
      });
    }, delay);
  }

  getMessage = () => {
    const { message } = this.props.step;
    return message;
  };

  renderMessage = () => {
    const { step, steps, previousStep, triggerNextStep } = this.props;
    const { component } = step;

    if (component) {
      return React.cloneElement(component, {
        step,
        steps,
        previousStep,
        triggerNextStep
      });
    }

    return this.getMessage();
  };

  render() {
    const { step, isFirst, isLast } = this.props;
    const { loading } = this.state;
    const { avatar, user } = step;

    return (
      <TextStepContainer user={user}>
        <ImageContainer user={user}>
          {isFirst && <Image user={user} src={avatar} />}
        </ImageContainer>
        <Bubble user={user} isFirst={isFirst} isLast={isLast}>
          {loading ? <Loading /> : this.renderMessage()}
        </Bubble>
      </TextStepContainer>
    );
  }
}

TextStep.propTypes = {
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  previousStep: PropTypes.objectOf(PropTypes.any),
  previousValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ]),
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  steps: PropTypes.objectOf(PropTypes.any),
  triggerNextStep: PropTypes.func.isRequired
};

TextStep.defaultProps = {
  previousStep: {},
  previousValue: "",
  steps: {}
};

export default TextStep;
