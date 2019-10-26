let inProgress = false;

const clipboardValue = document.getElementById("clipboardValue");

document.addEventListener("paste", () => {
  clipboardValue.value = null;

  if (inProgress) {
    return;
  }

  inProgress = true;

  setStatus("Loading...");

  setTimeout(() => {
    const text = clipboardValue.value;

    $.post(
      "http://localhost:6060",
      { text },
      data => {
        inProgress = false;

        setStatus("Now copy... (Ctrl + C)");

        clipboardValue.value = data.text;
      },
      "json"
    );

    clipboardValue.value = null;
  });
});

document.addEventListener("copy", e => {
  e.preventDefault();

  const text = clipboardValue.value;

  e.clipboardData.setData("text/plain", text);

  setStatus("Copied into clipboard! Ctrl + V again?");
});

clipboardValue.addEventListener("blur", () => {
  clipboardValue.select();
});

clipboardValue.select();

function setStatus(text) {
  document.getElementById("appStatus").innerHTML = text;
}

setStatus("Paste your text (Ctrl + V)");
