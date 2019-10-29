import React, { Component } from "react";
import PropTypes from "prop-types";
import Loading from "../common/Loading";
import CustomStepContainer from "./CustomStepContainer";

class CustomStep extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    const { step, triggerNextStep } = this.props;
    const { delay, waitAction } = step;

    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!waitAction && !step.rendered) {
          triggerNextStep();
        }
      });
    }, delay);
  }

  renderComponent = () => {
    const { step, steps, previousStep, triggerNextStep } = this.props;
    const { component } = step;

    return React.cloneElement(component, {
      step,
      steps,
      previousStep,
      triggerNextStep
    });
  };

  render() {
    const { loading } = this.state;

    return (
      <CustomStepContainer
        className="rsc-cs"
        showParams={this.props.showParams}
      >
        {loading ? (
          this.props.step.id === "json" ? null : (
            <Loading />
          )
        ) : (
          this.renderComponent()
        )}
      </CustomStepContainer>
    );
  }
}

CustomStep.propTypes = {
  previousStep: PropTypes.objectOf(PropTypes.any).isRequired,
  previousValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ]),
  step: PropTypes.objectOf(PropTypes.any).isRequired,
  steps: PropTypes.objectOf(PropTypes.any).isRequired,
  triggerNextStep: PropTypes.func.isRequired
};
CustomStep.defaultProps = {
  previousValue: ""
};

export default CustomStep;
