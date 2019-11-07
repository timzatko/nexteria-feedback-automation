/**
 * @type {JQueryStatic}
 */
const $ = jQuery;

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
  const tableDataElements = $(htmlString).find("td");

  const textArray = [];
  tableDataElements.each((i, e) => {
    const trimmedText = e.innerText.trim();

    if (trimmedText !== "") {
      textArray.push(trimmedText);
    }
  });

  const textString = textArray.join(" !@#$#@! ");

  return textString;
}

function extractCheckedText(htmlString) {
  let checkedText = $(htmlString)
    .find("div.recinside")
    .text();

  checkedText = checkedText.replace(/ !@#\$#@! /gim, "\n");

  return checkedText;
}

function setClipboardContent(event, checkedText) {
  event.clipboardData.setData("text/plain", checkedText);

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
  const originalText = extractOriginalText(originalHtmlString);

  setStatus("Loading...");

  const htmlString = await requestHtml(originalText);
  const checkedText = extractCheckedText(htmlString);

  clipboardData = checkedText;

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
