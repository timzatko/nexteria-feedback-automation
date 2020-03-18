function getResponses(url, apiKey, clientId) {
    console.log(url, apiKey, clientId);

    return loadGoogleApi()
        .then(initClient(apiKey, clientId))
        .then(getAuthInstance)
        .then(signIn)
        .then(getSpreadsheet('1Z4WXj3utPnatIVk37jqB5RhYuCwOAxJJjhuBTJ2vA3A'))
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
        console.debug('Client and OAuth2 modules have been loaded.');

        return window.gapi.client.init({
            apiKey,
            clientId,
            scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly',
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
    };
}

function getAuthInstance() {
    console.log('Client has been initialized.');

    return window.gapi.auth2.getAuthInstance();
}

function signIn(GoogleAuth) {
    const user = GoogleAuth.currentUser.get();

    console.debug({ user });

    if (!GoogleAuth.isSignedIn.get()) {
        return GoogleAuth.signIn().then(() => GoogleAuth);
    }

    return GoogleAuth;
}

function getSpreadsheet(spreadsheetId) {
    return function() {
        const params = {
            spreadsheetId,
            fields: 'sheets',
        };

        return window.gapi.client.sheets.spreadsheets.get(params);
    };
}

function getSpreadsheetData(spreadsheet) {
    const rawRowData = spreadsheet.result.sheets[0].data[0].rowData;
    const rowData = rawRowData.map(row => {
        const rowCells = row.values.map(rowCell => {
            if (rowCell.userEnteredValue) {
                if (rowCell.userEnteredValue.stringValue) {
                    return rowCell.userEnteredValue.stringValue;
                } else if (rowCell.userEnteredValue.numberValue) {
                    return String(rowCell.userEnteredValue.numberValue);
                } else {
                    return '';
                }
            }
        });
        return rowCells;
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
    console.log(columnData);

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

// function mock() {
//     return new Promise(resolve =>
//         setTimeout(
//             () =>
//                 resolve({
//                     response_count: 20, // pocet respondentov
//                     nps_promoter_percentage: 65,
//                     nps_detractor_percentage: 20,
//                     comments_rating: [
//                         'Pretože to bolo super, veľmi rozhľadený pán, dobre sa ho počúvalo.',
//                         'Politika má veľký vplyv na život každého z nás a je dôležité pochopiť aká v skutočnosti môže byť.',
//                     ],
//                     comments_outcome: ['Že treba mať nádej', 'ĽSNS môže byť ešte nebezpečnejšie ako sa zdá.'],
//                     comments_appreciation: ['Rozhľadenosť, múdrosť, skúsenosti'],
//                     comments_suggestions: [
//                         'Odpovede na otázky by mohli byť stručnejšie, aby sme stihli viac otázok a nemuseli by zachádzať do takých historických detailov.',
//                     ],
//                     comments_other: [
//                         'My sme bohužiaľ kvôli záverečnej prezentácii na PVP meškali asi 20 minút a mali sme problém sa dostať do vnútra. Tak by bolo do budúcna fajn v takýchto prípadoch mať človeka na telefóne, ktorý by nám prišiel otvoriť :) (Hosť nedvíhal telefón, chápem aj to sa môže štát:) )',
//                     ],
//                 }),
//             1000,
//         ),
//     );
// }

export default getResponses;
