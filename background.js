var webhookUrl = "";
var characterName = "DnDiscord";
var avatarUrl = "";

function postToWebhook(message) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", webhookUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  xhr.send(JSON.stringify(message));

  xhr.onload = function (res) {
    console.log("posted: ", res);
  };

  xhr.onerror = function (res) {
    console.log("error posting: ", res);
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse({});
  console.log(request);
  if (request.type === "update") {
    refreshVars();
  }

  if (request.type === "sendRoll") {
    postToWebhook(request.message);
  }
});

function refreshVars() {
  chrome.storage.sync.get(["webhookUrl"], function (data) {
    webhookUrl = data.webhookUrl;
    console.log("url: " + webhookUrl);
    if (webhookUrl) {
      // postToWebhook("asdf");
    }
  });
}

refreshVars();
