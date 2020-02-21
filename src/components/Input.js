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
            return this.getInput();
        }

        return (
            <div className="form-group">
                <label htmlFor={this.props.inputKey}>{this.props.name}</label>
                {this.getInput()}
                <small id={`${this.props.inputKey}Help`} className="form-text text-muted">
                    {this.props.helpText}
                </small>
            </div>
        );
    };

    getInput = () => {
        const { type, inputKey, placeholder } = this.props;

        return (
            <input
                type={type || 'text'}
                className="form-control"
                aria-describedby={`${inputKey}Help`}
                id={inputKey}
                value={this.state.value}
                onChange={event => this.handleInputChange(event)}
                placeholder={placeholder}
            />
        );
    };
}

export default Input;
