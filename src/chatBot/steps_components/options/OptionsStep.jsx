import React, {Component} from "react";
import PropTypes from "prop-types";
import Option from "./Option";
import OptionElement from "./OptionElement";
import Options from "./Options";

class OptionsStep extends Component {
    onOptionClick = ({value}) => {
        const {triggerNextStep} = this.props;

        triggerNextStep({value});
    };

    renderOption = option => {
        const {bubbleOptionStyle, step} = this.props;
        const {user} = step;
        const {value, label} = option;

        return (
            <Option key={value} className="rsc-os-option">
                <OptionElement
                    className="rsc-os-option-element"
                    style={bubbleOptionStyle}
                    user={user}
                    onClick={() => this.onOptionClick({value})}>
                    {label}
                </OptionElement>
            </Option>
        );
    };

    render() {
        const {step} = this.props;
        const {options} = step;

        return (
            <div>
                <Options className="rsc-os-options">
                    {Object.keys(options)
                        .map(key => options[key])
                        .map(this.renderOption)}
                </Options>
            </div>
        );
    }
}

OptionsStep.propTypes = {
    bubbleOptionStyle: PropTypes.objectOf(PropTypes.any).isRequired,
    step: PropTypes.objectOf(PropTypes.any).isRequired,
    triggerNextStep: PropTypes.func.isRequired
};

export default OptionsStep;
