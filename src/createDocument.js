import getResponses from './getResponses';

import PizZip from 'pizzip';
import JsZipUtils from 'jszip-utils';
import Docxtemplater from 'docxtemplater';
import FileSaver from 'file-saver';

function createDocument(url, document, api_key, client_id) {
    return getResponses(url, api_key, client_id)
        .then(responses => {
            const { nps_promoter_percentage, nps_detractor_percentage } = responses;

            return {
                ...document,
                ...responses,
                nps_aggregate_percentage: nps_promoter_percentage - nps_detractor_percentage,
            };
        })
        .then(data => {
            return loadFile('./templates/default.docx').then(content => {
                const zip = new PizZip(content);
                const documentTemplate = new Docxtemplater().loadZip(zip);

                documentTemplate.setData(data);

                try {
                    // render the document
                    documentTemplate.render();
                } catch (error) {
                    if (error.properties && error.properties.errors instanceof Array) {
                        throw error.properties.errors
                            .map(function(error) {
                                return error.properties.explanation;
                            })
                            .map(errorMessage => new Error(errorMessage));
                    } else {
                        throw error;
                    }
                }

                const outputFile = documentTemplate.getZip().generate({
                    type: 'blob',
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });

                FileSaver.saveAs(outputFile, 'output.docx');
            });
        });
}

function loadFile(url) {
    return JsZipUtils.getBinaryContent(url, undefined);
}

export default createDocument;
