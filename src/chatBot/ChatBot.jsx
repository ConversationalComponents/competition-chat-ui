import React, { Component } from "react";
import PropTypes from "prop-types";
import { CustomStep, OptionsStep, TextStep } from "./steps_components";
import schema from "./schemas/schema";
import ChatBotContainer from "./components/ChatBotContainer";
import Content from "./components/Content";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import SubmitButton from "./components/SubmitButton";
import { SubmitIcon } from "./icons";

const uuidv4 = require("uuid/v4");

class ChatBot extends Component {
  constructor(props) {
    super(props);

    this.content = null;
    this.supportsScrollBehavior = false;

    this.state = {
      renderedSteps: [],
      previousSteps: [],
      currentStep: {},
      previousStep: {},
      steps: {},
      disabled: true,
      inputValue: "",
      inputInvalid: false,
      defaultUserSettings: {}
    };
  }

  componentDidMount() {
    const { steps } = this.props;
    const {
      botDelay,
      botAvatar,
      customDelay,
      userAvatar,
      userDelay
    } = this.props;
    const chatSteps = {};

    const defaultBotSettings = { delay: botDelay, avatar: botAvatar };
    const defaultUserSettings = {
      delay: userDelay,
      avatar: userAvatar,
      hideInput: false
    };
    const defaultCustomSettings = { delay: customDelay };

    for (let i = 0, len = steps.length; i < len; i += 1) {
      const step = steps[i];
      let settings = {};

      if (step.user) {
        settings = defaultUserSettings;
      } else if (step.message || step.asMessage) {
        settings = defaultBotSettings;
      } else if (step.component) {
        settings = defaultCustomSettings;
      }

      chatSteps[step.id] = Object.assign({}, settings, schema.parse(step));
    }

    schema.checkInvalidIds(chatSteps);

    const firstStep = steps[0];

    if (firstStep.message) {
      const { message } = firstStep;
      firstStep.message = typeof message === "function" ? message() : message;
      chatSteps[firstStep.id].message = firstStep.message;
    }

    this.supportsScrollBehavior =
      "scrollBehavior" in document.documentElement.style;

    const currentStep = firstStep;
    const renderedSteps = [chatSteps[currentStep.id]];
    const previousSteps = [chatSteps[currentStep.id]];
    const previousStep = {};

    this.setState({
      currentStep,
      defaultUserSettings,
      previousStep,
      previousSteps,
      renderedSteps,
      steps: chatSteps
    });
  }

  onNodeInserted = event => {
    const { currentTarget: target } = event;

    if (this.supportsScrollBehavior) {
      target.scroll({
        top: target.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    } else {
      target.scrollTop = target.scrollHeight;
    }
  };

  onValueChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  getTriggeredStep = (trigger, value) => {
    const steps = this.generateRenderedStepsById();
    return typeof trigger === "function" ? trigger({ value, steps }) : trigger;
  };

  getStepMessage = message => {
    const { previousSteps } = this.state;
    const lastStepIndex =
      previousSteps.length > 0 ? previousSteps.length - 1 : 0;
    const steps = this.generateRenderedStepsById();
    const previousValue = previousSteps[lastStepIndex].value;
    return typeof message === "function"
      ? message({ previousValue, steps })
      : message;
  };

  generateRenderedStepsById = () => {
    const { previousSteps } = this.state;
    const steps = {};

    for (let i = 0, len = previousSteps.length; i < len; i += 1) {
      const { id, message, value, metadata } = previousSteps[i];

      steps[id] = {
        id,
        message,
        value,
        metadata
      };
    }

    return steps;
  };

  triggerNextStep = data => {
    const {
      defaultUserSettings,
      previousSteps,
      renderedSteps,
      steps
    } = this.state;

    let { currentStep, previousStep } = this.state;

    if (data && data.value) {
      currentStep.value = data.value;
    }
    if (data && data.hideInput) {
      currentStep.hideInput = data.hideInput;
    }
    if (data && data.trigger) {
      currentStep.trigger = this.getTriggeredStep(data.trigger, data.value);
    }

    if (currentStep.options && data) {
      const option = currentStep.options.filter(o => o.value === data.value)[0];
      const trigger = this.getTriggeredStep(option.trigger, currentStep.value);
      delete currentStep.options;

      // replace choose option for user message
      currentStep = Object.assign(
        {},
        currentStep,
        option,
        defaultUserSettings,
        {
          user: true,
          message: option.label,
          trigger
        }
      );

      renderedSteps.pop();
      previousSteps.pop();
      renderedSteps.push(currentStep);
      previousSteps.push(currentStep);

      this.setState({
        currentStep,
        renderedSteps,
        previousSteps
      });
    } else if (currentStep.trigger) {
      if (currentStep.replace) {
        renderedSteps.pop();
      }

      const trigger = this.getTriggeredStep(
        currentStep.trigger,
        currentStep.value
      );
      let nextStep = Object.assign({}, steps[trigger]);

      if (nextStep.message) {
        nextStep.message = this.getStepMessage(nextStep.message);
      } else if (nextStep.update) {
        const updateStep = nextStep;
        nextStep = Object.assign({}, steps[updateStep.update]);

        if (nextStep.options) {
          for (let i = 0, len = nextStep.options.length; i < len; i += 1) {
            nextStep.options[i].trigger = updateStep.trigger;
          }
        } else {
          nextStep.trigger = updateStep.trigger;
        }
      }

      nextStep.key = uuidv4();

      previousStep = currentStep;
      currentStep = nextStep;

      this.setState({ renderedSteps, currentStep, previousStep }, () => {
        if (nextStep.user) {
          this.setState({ disabled: false });
        } else {
          renderedSteps.push(nextStep);
          previousSteps.push(nextStep);

          this.setState({ renderedSteps, previousSteps });
        }
      });
    }
  };

  isInputValueEmpty = () => {
    const { inputValue } = this.state;
    return !inputValue || inputValue.length === 0;
  };

  isLastPosition = step => {
    const { renderedSteps } = this.state;
    const { length } = renderedSteps;
    const stepIndex = renderedSteps.map(s => s.key).indexOf(step.key);

    if (length <= 1 || stepIndex + 1 === length) {
      return true;
    }

    const nextStep = renderedSteps[stepIndex + 1];
    const hasMessage = nextStep.message || nextStep.asMessage;

    if (!hasMessage) {
      return true;
    }

    const isLast = step.user !== nextStep.user;
    return isLast;
  };

  isFirstPosition = step => {
    const { renderedSteps } = this.state;
    const stepIndex = renderedSteps.map(s => s.key).indexOf(step.key);

    if (stepIndex === 0) {
      return true;
    }

    const lastStep = renderedSteps[stepIndex - 1];
    const hasMessage = lastStep.message || lastStep.asMessage;

    if (!hasMessage) {
      return true;
    }

    const isFirst = step.user !== lastStep.user;
    return isFirst;
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.submitUserMessage();
    }
  };

  submitUserMessage = () => {
    const {
      defaultUserSettings,
      inputValue,
      previousSteps,
      renderedSteps
    } = this.state;
    let { currentStep } = this.state;

    const step = {
      message: inputValue,
      value: inputValue
    };

    currentStep = Object.assign({}, defaultUserSettings, currentStep, step);

    renderedSteps.push(currentStep);
    previousSteps.push(currentStep);

    this.setState({
      currentStep,
      renderedSteps,
      previousSteps,
      disabled: true,
      inputValue: ""
    });
  };

  renderStep = (step, index, showParams) => {
    const { renderedSteps } = this.state;
    const { options, component, asMessage } = step;
    const steps = this.generateRenderedStepsById();
    const previousStep = index > 0 ? renderedSteps[index - 1] : {};

    if (component && !asMessage) {
      return (
        <CustomStep
          showParams={showParams}
          key={index}
          step={step}
          steps={steps}
          previousStep={previousStep}
          previousValue={previousStep.value}
          triggerNextStep={this.triggerNextStep}
        />
      );
    }

    if (options) {
      return (
        <OptionsStep
          key={index}
          step={step}
          previousValue={previousStep.value}
          triggerNextStep={this.triggerNextStep}
        />
      );
    }

    return (
      <TextStep
        key={index}
        step={step}
        steps={steps}
        previousStep={previousStep}
        previousValue={previousStep.value}
        triggerNextStep={this.triggerNextStep}
        isFirst={this.isFirstPosition(step)}
        isLast={this.isLastPosition(step)}
      />
    );
  };

  render() {
    const {
      currentStep,
      disabled,
      inputInvalid,
      inputValue,
      renderedSteps
    } = this.state;
    const {
      headerTitle,
      placeholder,
      width,
      height,
      showParams,
      setShowParams
    } = this.props;
    const icon = <SubmitIcon />;
    const inputPlaceholder = currentStep.placeholder || placeholder;

    return (
      <ChatBotContainer width={width} height={height}>
        <Header
          headerTitle={headerTitle}
          showParams={showParams}
          setShowParams={setShowParams}
        />
        <Content
          showParams={showParams}
          onNodeInserted={this.onNodeInserted}
          height={height}
        >
          {renderedSteps.map((step, index) =>
            this.renderStep(step, index, showParams)
          )}
        </Content>
        <Footer>
          <Input
            renderedSteps={renderedSteps}
            inputInvalid={inputInvalid}
            inputPlaceholder={inputPlaceholder}
            onKeyPress={this.handleKeyPress}
            onChange={this.onValueChange}
            value={inputValue}
            disabled={disabled}
          />

          <SubmitButton
            onClick={this.submitUserMessage}
            invalid={inputInvalid}
            disabled={disabled}
          >
            {icon}
          </SubmitButton>
        </Footer>
      </ChatBotContainer>
    );
  }
}

ChatBot.propTypes = {
  botAvatar: PropTypes.string,
  botDelay: PropTypes.number,
  customDelay: PropTypes.number,
  headerTitle: PropTypes.string,
  height: PropTypes.string,
  placeholder: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  userAvatar: PropTypes.string,
  userDelay: PropTypes.number,
  width: PropTypes.string
};

ChatBot.defaultProps = {
  botDelay: 1000,
  customDelay: 1000,
  headerTitle: "Chat",
  height: "520px",
  placeholder: "Type the message ...",
  userDelay: 1000,
  width: "350px",
  botAvatar:
    "data:image/svg+xml,%3csvg version='1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath d='M303 70a47 47 0 1 0-70 40v84h46v-84c14-8 24-23 24-40z' fill='%2393c7ef'/%3e%3cpath d='M256 23v171h23v-84a47 47 0 0 0-23-87z' fill='%235a8bb0'/%3e%3cpath fill='%2393c7ef' d='M0 240h248v124H0z'/%3e%3cpath fill='%235a8bb0' d='M264 240h248v124H264z'/%3e%3cpath fill='%2393c7ef' d='M186 365h140v124H186z'/%3e%3cpath fill='%235a8bb0' d='M256 365h70v124h-70z'/%3e%3cpath fill='%23cce9f9' d='M47 163h419v279H47z'/%3e%3cpath fill='%2393c7ef' d='M256 163h209v279H256z'/%3e%3cpath d='M194 272a31 31 0 0 1-62 0c0-18 14-32 31-32s31 14 31 32z' fill='%233c5d76'/%3e%3cpath d='M380 272a31 31 0 0 1-62 0c0-18 14-32 31-32s31 14 31 32z' fill='%231e2e3b'/%3e%3cpath d='M186 349a70 70 0 1 0 140 0H186z' fill='%233c5d76'/%3e%3cpath d='M256 349v70c39 0 70-31 70-70h-70z' fill='%231e2e3b'/%3e%3c/svg%3e",
  userAvatar:
    "data:image/svg+xml,%3csvg viewBox='-208.5 21 100 100' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ccircle cx='-158.5' cy='71' fill='%23F5EEE5' r='50'/%3e%3cdefs%3e%3ccircle cx='-158.5' cy='71' id='a' r='50'/%3e%3c/defs%3e%3cclipPath id='b'%3e%3cuse overflow='visible' xlink:href='%23a'/%3e%3c/clipPath%3e%3cpath clip-path='url(%23b)' d='M-108.5 121v-14s-21.2-4.9-28-6.7c-2.5-.7-7-3.3-7-12V82h-30v6.3c0 8.7-4.5 11.3-7 12-6.8 1.9-28.1 7.3-28.1 6.7v14h100.1z' fill='%23E6C19C'/%3e%3cg clip-path='url(%23b)'%3e%3cdefs%3e%3cpath d='M-108.5 121v-14s-21.2-4.9-28-6.7c-2.5-.7-7-3.3-7-12V82h-30v6.3c0 8.7-4.5 11.3-7 12-6.8 1.9-28.1 7.3-28.1 6.7v14h100.1z' id='c'/%3e%3c/defs%3e%3cclipPath id='d'%3e%3cuse overflow='visible' xlink:href='%23c'/%3e%3c/clipPath%3e%3cpath clip-path='url(%23d)' d='M-158.5 100.1c12.7 0 23-18.6 23-34.4 0-16.2-10.3-24.7-23-24.7s-23 8.5-23 24.7c0 15.8 10.3 34.4 23 34.4z' fill='%23D4B08C'/%3e%3c/g%3e%3cpath d='M-158.5 96c12.7 0 23-16.3 23-31 0-15.1-10.3-23-23-23s-23 7.9-23 23c0 14.7 10.3 31 23 31z' fill='%23F2CEA5'/%3e%3c/svg%3e"
};

export default ChatBot;
