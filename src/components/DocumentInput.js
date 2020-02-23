import Input from './Input';

class DocumentInput extends Input {
    constructor(props) {
        super(props);

        this.handleChange.bind(this);
    }

    static getDerivedStateFromProps = (props, state) => {
        if (typeof props.document === 'undefined') {
            throw new Error('document needs to be passed through props!');
        }

        if (typeof props.document[props.inputKey] !== 'undefined') {
            return { value: props.document[props.inputKey] };
        }

        return super.getDerivedStateFromProps(props, state);
    };

    handleChange(value) {
        super.handleChange(value);

        const { inputKey, document } = this.props;

        document[inputKey] = value;

        if (typeof this.props.onDocumentChange === 'function') {
            this.props.onDocumentChange(document);
        }
    }
}

export default DocumentInput;
