/**
 * @type {JQueryStatic}
 */
const $ = jQuery;
/**
 * @type {import("lodash").LoDashStatic}
 */
const lodash = _
_ = lodash
delete lodash

let clipboardData = "";

function getClipboardContent(event) {
    const clipboardContent = event.clipboardData.getData("text/html");
    event.clipboardData.clearData();
    event.preventDefault();

    return clipboardContent;
}

/**
 * Sends a HTTP request with a provided 'method' and 'text' to a spell-checking
 * page: https://diakritik.juls.savba.sk.
 *
 * @param {string} method
 *   A method accepted by the spell-checking page.
 *   Default: '4gram'
 * @param {string} text Text to spell-check and automatically fix mistakes.
 * @returns {string} String with HTML returned in the response.
 * @example
 *   requestHtml('Rekonstruovat')
 */
async function requestHtml(text, method = "4gram") {
    const fetchParams = new URLSearchParams();
    fetchParams.set("method", method);
    fetchParams.set("text", text);

    const fetchInit = {
        method: "POST",
        mode: "cors",
        body: fetchParams
    };

    let fetchRequest = new Request(
        "https://cors-anywhere.herokuapp.com/https://diakritik.juls.savba.sk"
    );

    const response = await fetch(fetchRequest, fetchInit);
    const htmlString = await response.text();

    return htmlString;
}

function extractOriginalText(htmlString) {
    const tableRowsJquery = $("<div />").append(htmlString).find("tr");

    // const rowCount = tableRows.length
    // const columnCount = tableRows.slice(0, 1).find("td").length

    const tableRowsArray = []
    tableRowsJquery.each((tableRowIndex, tableRowElement) => {
        const rowArray = []
        const cellsJquery = $("<div />").append(tableRowElement).find("td")
        cellsJquery.each((cellIndex, cellElement) => {
            const cellText = cellElement
                .innerHTML
                // .slice(1, -1)
                // .replace(/<br>/gim, " \\n ")
                // .replace(/\\n/gim, "\n")
            rowArray.push(cellText)
        })

        tableRowsArray.push(rowArray)
    })

    // const transposedTableRowsArray = _.zip(...tableRowsArray)
    /**
     * @type {Array<Array<String>>}
     */
    const transposedTableRowsArray = _.zip.apply(_, tableRowsArray)

    let textString = ""
    for (let columnCellsArray of transposedTableRowsArray) {
        columnCellsArray = columnCellsArray.filter(
            (columnCellString) => {
                return columnCellString.trim() !== ""
            }
        )

        listLabelHtmlString = "<p>" + columnCellsArray[0] + "</p>"
        listEntriesArray = columnCellsArray.slice(1)
        const listEntriesHtmlArray = listEntriesArray.map((columnCellString, ) => {
            return "<li>" + columnCellString + "</li>"
        })

        const listEntriesHtmlString = listEntriesHtmlArray.join("")
        const divListJquery = $("<div />").append("<ul />")
        const listJquery = divListJquery.find("ul").append(listEntriesHtmlString)

        textString += listLabelHtmlString + divListJquery.html()
    }

    textString = textString
        .replace(/p>/gim, "!>")
        .replace(/ul>/gim, "@>")
        .replace(/li>/gim, "#>")
        .replace(/br>/gim, "%>")

    return textString;
}

function extractCheckedTextHtml(htmlString) {
    let checkedTextHtml = $(htmlString)
        .find("div.recinside")
        .text()
        .replace(/!>/gim, "p>")
        .replace(/@>/gim, "ul>")
        .replace(/#>/gim, "li>")
        .replace(/%>/gim, "br>")

    return checkedTextHtml;
}

function setClipboardContent(event, checkedText) {
    event.clipboardData.setData("text/html", checkedText);

    // EXP: Setting clipboard content in Google Chrome does not work without
    // the following line.
    event.preventDefault();
}

function setStatus(text) {
    document.getElementById("appStatus").innerHTML = text;

    exampleImg.hide();
}

const exampleImg = $("img.example");

document.addEventListener("paste", async event => {
    const originalHtmlString = getClipboardContent(event);
    const originalTextTranslationForm = extractOriginalText(originalHtmlString);

    console.log(originalTextTranslationForm)

    setStatus("Loading...");

    const htmlString = await requestHtml(originalTextTranslationForm);
    const checkedTextHtml = extractCheckedTextHtml(htmlString);

    console.log(checkedTextHtml)

    clipboardData = checkedTextHtml;

    setStatus("Now copy... (Ctrl + C)");
});

document.addEventListener("copy", async event => {
    setClipboardContent(event, clipboardData);

    clipboardData = "";

    setStatus(
        "Copied into clipboard! Now paste the columns back to the spreadsheet. You can also do Ctrl + V again."
    );
    exampleImg.show();
});

setStatus(
    "Copy the columns from Google Spreadsheet and paste them here. (Ctrl + V)"
);
exampleImg.show();