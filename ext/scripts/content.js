const getNodeByText = (text, index = 1, type = "span") => {
  return document.evaluate(
    `(//body//${type}[text()='${text}'])[${index}]`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "submit-time-cards") {
    getNodeByText("Add").click();

    const observer = new MutationObserver((mutations, instance) => {
      getNodeByText("Actions", 2).click();
      clickCopyAfter(2);
      instance.disconnect();
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }
});

const clickCopyAfter = (delay) => {
  new Promise((resolve) => setTimeout(resolve, delay * 1000)).then(() => {
    getNodeByText("Copy Previous Time Card", 1, "td").click();
    // clickSubmitAfter(5)
  });
};

// const clickSubmitAfter = (delay) => {
//   new Promise((resolve) => setTimeout(resolve, delay * 1000)).then(() => {
//     for (const a of document.querySelectorAll("span")) {
//       if (a.textContent.includes("Sub")) {
//         a.click();
//       }
//     }
//   });
// };
