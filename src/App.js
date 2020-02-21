import React from 'react';

import Input from './components/Input';
import Storage from './utils/Storage';
import DocumentInput from './components/DocumentInput';

import createDocument from './createDocument';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            document: {},
            url: undefined,
            credentials: undefined,
            status: { type: 'pristine' },
            inProgress: false,
        };
    }

    render = () => {
        const { inProgress } = this.state;

        return (
            <div className="container">
                <div className="py-5 text-center">
                    <img className="d-block mx-auto mb-4" src="./images/nexteria-logo.png" height="120px" alt="" />
                    <h2>Nexteria - Automatizácia spätnej väzby</h2>
                    <p className="lead">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula justo arcu, ac mollis
                        tellus ornare quis. Nunc a nulla suscipit, maximus orci eget, faucibus turpis. Sed id suscipit
                        odio. Sed scelerisque purus imperdiet urna venenatis viverra. Etiam tristique elit quis ipsum
                        auctor fermentum. Donec quis arcu nec orci fermentum posuere.
                    </p>
                </div>

                <div className="row">
                    <form>
                        <div className={inProgress ? 'in-progress' : null}>
                            <h2>Formulár</h2>
                            <Input
                                helpText={
                                    <span>
                                        Príklad:{' '}
                                        <i>
                                            https://docs.google.com/forms/d/1Ooo0Lv3Zqk4yjcB2SMYDlDqZpPhCjqFvv1Aae01LTIU/edit
                                        </i>
                                    </span>
                                }
                                inputKey={'url'}
                                name="URL Adresa Google Formulára"
                                onChange={url => this.setState({ url })}
                                value={this.state.url}
                            />
                            <h3>Titulná strana</h3>
                            <div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Poďakovanie</span>
                                        </div>
                                        <DocumentInput
                                            detachInput={true}
                                            document={this.state.document}
                                            inputKey={'acknowledgment'}
                                            onDocumentChange={this.handleDocumentChange}
                                        />
                                        <div>
                                            <span className="input-group-text">
                                                vo forme vyhodnotenia spätnej väzby účastníkov
                                            </span>
                                        </div>
                                        <DocumentInput
                                            detachInput={true}
                                            document={this.state.document}
                                            inputKey={'event_name'}
                                            onDocumentChange={this.handleDocumentChange}
                                        />
                                    </div>
                                    <small className="form-text text-muted">
                                        Príklad:{' '}
                                        <i>
                                            Poďakovanie <b>Jožkovi Mrkvičkovi</b> vo forme vyhodnotenia spätnej väzby
                                            účastníkov <b>diskusie bez kravaty</b>
                                        </i>
                                    </small>
                                </div>
                                <DocumentInput
                                    document={this.state.document}
                                    helpText={
                                        <span>
                                            Príklad: <i>11.2.2020</i>
                                        </span>
                                    }
                                    name="Dátum kurzu"
                                    inputKey={'date'}
                                    onDocumentChange={this.handleDocumentChange}
                                />
                                <DocumentInput
                                    document={this.state.document}
                                    helpText={
                                        <span>
                                            Príklad: <i>Nexteria</i>
                                        </span>
                                    }
                                    inputKey={'place'}
                                    name="Miesto"
                                    onDocumentChange={this.handleDocumentChange}
                                />
                                <DocumentInput
                                    document={this.state.document}
                                    helpText={
                                        <span>
                                            Príklad: <i>20.2.2020</i>
                                        </span>
                                    }
                                    inputKey={'document_created_date'}
                                    name="Dátum vytvorenia dokumentu"
                                    onDocumentChange={this.handleDocumentChange}
                                />
                                <DocumentInput
                                    document={this.state.document}
                                    helpText={
                                        <span>
                                            Príklad: <i>Lenka Koczová</i>
                                        </span>
                                    }
                                    inputKey={'document_owner_name'}
                                    name="Vlastník dokumentu"
                                    onDocumentChange={this.handleDocumentChange}
                                />
                                <DocumentInput
                                    document={this.state.document}
                                    helpText={
                                        <span>
                                            Príklad: <i>lenka.koczova@nexteria.sk</i>
                                        </span>
                                    }
                                    inputKey={'document_owner_email'}
                                    name="Kontakt"
                                    onDocumentChange={this.handleDocumentChange}
                                />
                            </div>
                            <h3>NPS</h3>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Priemerné NPS kurzov za </span>
                                    </div>
                                    <DocumentInput
                                        detachInput={true}
                                        document={this.state.document}
                                        inputKey={'nps_mean_semester_name'}
                                        onDocumentChange={this.handleDocumentChange}
                                    />
                                    <div>
                                        <span className="input-group-text">semester</span>
                                    </div>
                                    <DocumentInput
                                        detachInput={true}
                                        document={this.state.document}
                                        inputKey={'nps_mean_semester_year'}
                                        onDocumentChange={this.handleDocumentChange}
                                    />
                                    <div>
                                        <span className="input-group-text">je</span>
                                    </div>
                                    <DocumentInput
                                        detachInput={true}
                                        document={this.state.document}
                                        inputKey={'nps_mean_percentage'}
                                        type={'number'}
                                        onDocumentChange={this.handleDocumentChange}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>
                                <small className="form-text text-muted">
                                    Príklad:{' '}
                                    <i>
                                        Priemerné NPS kurzov za <b>letný</b> semester <b>2018/2019</b> je <b>66%</b>.
                                    </i>
                                </small>
                            </div>
                            <h2>Autorizácia do Google Forms API</h2>
                            <Input
                                helpText={
                                    <span>
                                        <a
                                            href="https://github.com/timzatko/nexteria-feedback-automation/tree/master/docs/GOOGLE_CREDENTIALS.md"
                                            target="_blank"
                                        >
                                            Návod
                                        </a>{' '}
                                        na získanie credentials.json
                                    </span>
                                }
                                inputKey={'credentials'}
                                name={'credentials.json'}
                                onChange={credentials => this.setState({ credentials })}
                                value={this.state.credentials}
                            />
                        </div>
                        {this.renderAlert()}
                        <div className="row">
                            <div className="col">
                                <button type="button" className="btn btn-primary" onClick={this.createDocument}>
                                    {inProgress ? (
                                        <span>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            &nbsp;
                                        </span>
                                    ) : null}
                                    Vytvoriť dokument
                                </button>
                            </div>
                            <div className="col text-right">
                                <button type="button" className="btn btn-danger" onClick={this.reset}>
                                    Zmazať formulár
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    handleDocumentChange = document => {
        this.setState({ document });
    };

    renderAlert() {
        const { status } = this.state;

        if (status.type === 'danger' && Array.isArray(status.message)) {
            return (
                <div className={`alert alert-${status.type}`} role="alert">
                    Chyba!
                    <ul>
                        {status.message.map(({ message }) => (
                            <li>{message}</li>
                        ))}
                    </ul>
                </div>
            );
        } else if (status.type === 'pristine') {
            return (
                <div className={`alert alert-${status.type}`} role="alert">
                    {status.message}
                </div>
            );
        }
    }

    createDocument = () => {
        const { url, document, credentials } = this.state;

        this.setState({ inProgress: true });

        createDocument(url, document, credentials)
            .then(() => {
                this.setStatus('success', 'Dokument bol úspešne vytvorený!');
            })
            .catch(error => {
                if (Array.isArray(error)) {
                    this.setStatus(
                        'danger',
                        error.map(({ message }) => message),
                    );
                } else {
                    this.setStatus('danger', error.message);
                }

                console.error(error);
            })
            .finally(() => {
                this.setState({ inProgress: false });
            });
    };

    reset() {
        if (window.confirm('Naozaj chcete zmazať formulár? Táto akcia sa už nedá vrátiť späť!')) {
            this.setState({ data: {} });

            Storage.clear();
        }
    }

    setStatus(type, message) {
        this.setState({ status: { type, message } });
    }
}

export default App;
