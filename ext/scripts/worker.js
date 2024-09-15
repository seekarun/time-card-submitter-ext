const submitTimeCard = async () => {
  const tab = await chrome.tabs.create({
    url: "https://eclf.fa.em2.oraclecloud.com/fscmUI/faces/deeplink?objType=PERSON_TIME_WORKAREA_RUI&action=NONE",
  });

  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (tabId === tab.id && info.status == "complete") {
      const response = await chrome.tabs.sendMessage(tabId, {
        action: "submit-time-cards",
      });
    }
  });
};

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.goto === "open-time-cards") {
    await submitTimeCard();
  }
});

// TODO: make this user configurable
const AlertTime = {
  day: 5, // Monday = 1
  hour: 12,
  minute: 0,
};

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  chrome.alarms.clearAll(async () => {
    await chrome.alarms.create("default-alarm", {
      delayInMinutes: 0.5,
      periodInMinutes: 1,
    });

    chrome.alarms.onAlarm.addListener(async (alarm) => {
      const time = new Date(alarm.scheduledTime);

      if (
        time.getDay() === AlertTime.day &&
        time.getHours() === AlertTime.hour &&
        time.getMinutes() === AlertTime.minute
      ) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "../images/icon128.png",
          title: "Submitted time-card yet?",
          message: `It's time to submit your time-card`,
          priority: 0,
        });
        await submitTimeCard();
      }
    });
  });
});
