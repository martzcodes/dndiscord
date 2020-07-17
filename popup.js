chrome.storage.sync.get(['webhookUrl'], function(data) {
    if('webhookUrl' in data) {
        document.getElementById("webhookUrl").value = data.webhookUrl;
        document.getElementById("webhookInfo").innerHTML = data.webhookUrl;
    }
});
document.getElementById("saveSettings").addEventListener("click", function(){
    chrome.storage.sync.set(
      {
        webhookUrl: document.getElementById("webhookUrl").value,
      },
      function () {
        chrome.runtime.sendMessage({ type: "update", update: 1 }, function (
          response
        ) {});
        document.getElementById(
          "webhookInfo"
        ).innerHTML = document.getElementById("webhookUrl").value;
      }
    );
});
