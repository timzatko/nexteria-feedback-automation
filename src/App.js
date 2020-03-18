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
            api_key: undefined,
            client_id: undefined,
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
                        Tento nástroj slúži na automatizáciu spätnej väzby. Návod na použitie je dostupný na{' '}
                        <a
                            href="https://github.com/timzatko/nexteria-feedback-automation/tree/master/docs/Documentation.md"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            tejto
                        </a>{' '}
                        stránke.
                        <br />
                    </p>
                </div>

                <div className="row">
                    <form>
                        <div className={inProgress ? 'in-progress' : null}>
                            <h2>Spreadsheet</h2>
                            <Input
                                helpText={
                                    <span>
                                        Príklad:{' '}
                                        <i>
                                            https://docs.google.com/spreadsheets/d/1Z4WXj3utPnatIVk37jqB5RhYuCwOAxJJjhuBTJ2vA3A/edit
                                        </i>
                                    </span>
                                }
                                inputKey={'url'}
                                name="URL Adresa Spreadsheet"
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
                                        options={[
                                            { key: 'letný', value: 'letný' },
                                            { key: 'zimný', value: 'zimný' },
                                        ]}
                                        type={'select'}
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
                            <p>
                                Návod na získanie <u>API Key</u> a <u>Client ID</u> sa nachádza v{' '}
                                <a
                                    href="https://github.com/timzatko/nexteria-feedback-automation/blob/master/docs/Documentation.md#z%C3%ADskanie-pr%C3%ADstupu-do-google-forms-api"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    dokumentácii
                                </a>
                                .
                            </p>
                            <Input
                                inputKey={'api_key'}
                                name={'API Key'}
                                onChange={api_key => this.setState({ api_key })}
                                value={this.state.api_key}
                            />
                            <Input
                                inputKey={'client_id'}
                                name={'Client ID'}
                                onChange={client_id => this.setState({ client_id })}
                                value={this.state.client_id}
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
                        {status.message.map((message, index) => (
                            <li key={index}>{message}</li>
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
        const { url, document, api_key, client_id } = this.state;

        this.setState({ inProgress: true });

        createDocument(url, document, api_key, client_id)
            .then(() => {
                this.setStatus('success', 'Dokument bol úspešne vytvorený!');
            })
            .catch(error => {
                if (Array.isArray(error)) {
                    this.setStatus('danger', error.map(this.getErrorMessage));
                } else {
                    this.setStatus('danger', [this.getErrorMessage(error)]);
                }

                console.error(error);
            })
            .finally(() => {
                this.setState({ inProgress: false });
            });
    };

    getErrorMessage(e) {
        return e.message || e.result.error.message;
    }

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
