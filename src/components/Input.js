import React from 'react';
import Storage from '../utils/Storage';

class Input extends React.Component {
    static getDerivedStateFromProps = props => {
        return { value: Storage.get(Input.getStorageKey(props)) || '' };
    };

    static getStorageKey = props => {
        return `${props.inputKey}Input`;
    };

    constructor(props) {
        super(props);

        this.state = {};

        this.handleChange.bind(this);
    }

    componentDidMount() {
        const { value } = this.state;

        this.handleChange(value);
    }

    handleInputChange(event) {
        const { value } = event.target;

        this.handleChange(value);
    }

    handleChange(value) {
        this.setState({ value });

        Storage.set(Input.getStorageKey(this.props), value);

        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(value);
        }
    }

    render = () => {
        if (this.props.detachInput) {
            return this.renderSingle();
        }

        return (
            <div className="form-group">
                <label htmlFor={this.props.inputKey}>{this.props.name}</label>
                {this.renderSingle()}
                <small id={`${this.props.inputKey}Help`} className="form-text text-muted">
                    {this.props.helpText}
                </small>
            </div>
        );
    };

    renderSingle = () => {
        const { type } = this.props;

        if (type === 'select') {
            return this.renderSelect();
        } else if (type === 'textarea') {
            return this.renderTextarea();
        }

        return this.renderInput();
    };

    renderInput = () => {
        const { type, inputKey, placeholder } = this.props;

        return (
            <input
                aria-describedby={`${inputKey}Help`}
                className="form-control"
                id={inputKey}
                onChange={event => this.handleInputChange(event)}
                placeholder={placeholder}
                type={type || 'text'}
                value={this.state.value}
            />
        );
    };

    renderSelect = () => {
        const { inputKey, options } = this.props;

        return (
            <select
                aria-describedby={`${inputKey}Help`}
                className="form-control"
                id={inputKey}
                onChange={event => this.handleInputChange(event)}
                value={this.state.value}
            >
                {(options || []).map(({ key, value }, index) => (
                    <option value={value} key={index}>
                        {key}
                    </option>
                ))}
            </select>
        );
    };

    renderTextarea = () => {
        const { inputKey } = this.props;

        return (
            <textarea
                aria-describedby={`${inputKey}Help`}
                className="form-control"
                id={inputKey}
                onChange={event => this.handleInputChange(event)}
                value={this.state.value}
            ></textarea>
        );
    };
}

export default Input;
