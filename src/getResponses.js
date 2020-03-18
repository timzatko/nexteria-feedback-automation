function getResponses(url, apiKey, clientId) {
    return loadGoogleApi()
        .then(initClient(apiKey, clientId))
        .then(getAuthInstance)
        .then(signIn)
        .then(getSpreadsheet(url))
        .then(getSpreadsheetData)
        .then(processSpreadsheetData);
}

function loadGoogleApi() {
    return new Promise(resolve => {
        window.gapi.load('client:auth2', resolve);
    });
}

function initClient(apiKey, clientId) {
    return function() {
        return window.gapi.client.init({
            apiKey,
            clientId,
            scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly',
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
    };
}

function getAuthInstance() {
    return window.gapi.auth2.getAuthInstance();
}

function signIn(GoogleAuth) {
    if (!GoogleAuth.isSignedIn.get()) {
        return GoogleAuth.signIn().then(() => GoogleAuth);
    }

    return GoogleAuth;
}

function getSpreadsheet(url) {
    return function() {
        const params = {
            spreadsheetId: getSpreadsheetId(url),
            fields: 'sheets',
        };

        return window.gapi.client.sheets.spreadsheets.get(params);
    };
}

function getSpreadsheetData(spreadsheet) {
    const rawRowData = spreadsheet.result.sheets[0].data[0].rowData;
    const rowData = rawRowData.map(row => {
        return row.values.map(rowCell => {
            if (rowCell.userEnteredValue) {
                if (rowCell.userEnteredValue.stringValue) {
                    return rowCell.userEnteredValue.stringValue;
                } else if (rowCell.userEnteredValue.numberValue) {
                    return String(rowCell.userEnteredValue.numberValue);
                }
            }
            return '';
        });
    });

    // row[0] -> Header row with questions
    const columnCount = rowData[0].length;
    const columnData = [];
    for (let i = 0; i < columnCount; i++) {
        columnData.push([]);
    }

    rowData.forEach((row, index) => {
        // First row -> Header (no responses)
        if (index === 0) {
            return;
        }
        // row[1] -> Email (required; no value -> invalid)
        if (typeof row[1] === 'undefined' || row[1].trim() === '') {
            return;
        }

        for (let i = 0; i < columnCount; i++) {
            if (typeof row[i] !== 'undefined' && row[i].trim() !== '') {
                columnData[i].push(row[i]);
            }
        }
    });

    return columnData;
}

function calculateNpsMetrics(npsScores, responseCount) {
    let promoterCount = 0;
    let detractorCount = 0;

    npsScores.forEach(npsScore => {
        if (npsScore >= 9) {
            promoterCount += 1;
        } else if (npsScore < 7) {
            detractorCount += 1;
        }
    });

    const nps_promoter_percentage = (promoterCount / responseCount) * 100;
    const nps_detractor_percentage = (detractorCount / responseCount) * 100;

    return {
        nps_promoter_percentage,
        nps_detractor_percentage,
    };
}

function processSpreadsheetData(columnData) {
    const response_count = columnData[1].length;
    const npsScores = columnData[2];
    const { nps_promoter_percentage, nps_detractor_percentage } = calculateNpsMetrics(npsScores, response_count);

    const comments_rating = columnData[3];
    const comments_outcome = columnData[4];
    const comments_appreciation = columnData[5];
    const comments_suggestions = columnData[6];
    const comments_other = columnData[7];

    return {
        response_count,
        nps_promoter_percentage,
        nps_detractor_percentage,
        comments_rating,
        comments_outcome,
        comments_appreciation,
        comments_suggestions,
        comments_other,
    };
}

function getSpreadsheetId(url) {
    const match = url.match(/^http[s]?:\/\/docs.google.com\/spreadsheets\/d\/([^/]+)/);

    if (!match) {
        throw new Error('Zadaná URL adresa nieje platná adresa pre Google Spreadsheet!');
    }

    return match[1];
}

export default getResponses;
