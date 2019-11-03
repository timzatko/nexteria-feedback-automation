/**
 * @type {JQueryStatic}
 */
const $ = jQuery

let clipboardData = ''

function getClipboardContent(event) {
  const clipboardContent = event.clipboardData.getData('text/html')
  event.clipboardData.clearData()
  event.preventDefault()

  return clipboardContent
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
async function requestHtml(text, method='4gram') {
  const fetchParams = new URLSearchParams()
  fetchParams.set('method', method)
  fetchParams.set('text', text)

  const fetchInit = {
    method: 'POST',
    mode: 'cors',
    body: fetchParams
  }

  let fetchRequest = new Request('https://cors-anywhere.herokuapp.com/https://diakritik.juls.savba.sk');

  const response = await fetch(fetchRequest, fetchInit)
  const htmlString = await response.text()

  return htmlString
}

function extractOriginalText(htmlString) {
  const tableDataElements = $(htmlString).find('td')

  const textArray = []
  tableDataElements.each((i, e) => {
    const trimmedText = e.innerText.trim()

    if (trimmedText !== '') {
      textArray.push(trimmedText)
    }
  })

  const textString = textArray.join(' !@#$#@! ')

  return textString
}

function extractCheckedText(htmlString) {
  let checkedText = $(htmlString).find('div.recinside').text()

  checkedText = checkedText
    .replace(/ !@#\$#@! /gmi, '\n')

  return checkedText
}

function setClipboardContent(event, checkedText) {
  console.log(checkedText)
  // navigator.clipboard.writeText(checkedText)
  event.clipboardData.setData('text/plain', checkedText)

  // EXP: Setting clipboard content in Google Chrome does not work without
  //      the following line.
  event.preventDefault()
}

document.addEventListener('paste', async (event) => {
  const originalHtmlString = getClipboardContent(event);
  const originalText = extractOriginalText(originalHtmlString)
  const htmlString = await requestHtml(originalText)
  const checkedText = extractCheckedText(htmlString)

  clipboardData = checkedText

  console.log('Checked!')
})

document.addEventListener('copy', async (event) => {
  setClipboardContent(event, clipboardData);

  clipboardData = ''

  console.log('Copied!')
})
