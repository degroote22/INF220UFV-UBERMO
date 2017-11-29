import * as React from "react";

class TextInput extends React.Component<{
  label: string;
  value: any;
  onChange: (value: any) => void;
  type: string;
  disabled: boolean;
}> {
  handleChange = (event: any) => this.props.onChange(event.target.value);
  render() {
    return (
      <div className="field">
        <label className="label">{this.props.label}</label>
        <div className="control">
          <input
            className="input"
            type={this.props.type}
            value={this.props.value}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    );
  }
}
export default TextInput;
