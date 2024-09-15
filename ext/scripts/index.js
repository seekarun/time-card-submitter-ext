const submitTimeCard = () => {
  chrome.runtime.sendMessage({ goto: "open-time-cards" }, () => {
    console.log("CALLBACK");
  });
};

document.getElementById("btn-submit").addEventListener("click", submitTimeCard);
