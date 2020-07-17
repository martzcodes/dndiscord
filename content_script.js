// Select the node that will be observed for mutations
const targetNode = document.getRootNode();

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

const sentRolls = {};
let actualUser = "DnDiscord";
let actualUserPic = "";

const convertColor = function (color) {
  if (color && color.indexOf("rgb") !== -1) {
    console.log(color);
    const regExp = /\(([^)]+)\)/;
    const [rRaw, gRaw, bRaw] = regExp.exec(color)[1].split(",");
    const r = parseInt(rRaw);
    const g = parseInt(gRaw);
    const b = parseInt(bRaw);

    console.log(`${r}, ${g}, ${b}`);
    return (b | (g << 8) | (r << 16)).toString();
  }
};

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      const notificationElement = document.getElementById(
        "noty_layout__bottomRight"
      );

      if (notificationElement) {
        const diceNotifications = [...notificationElement.childNodes].filter(
          (childNode) => childNode.id && !sentRolls[childNode.id]
        );
        if (diceNotifications.length > 0) {
          const actualUserDivs = document.getElementsByClassName(
            "user-interactions-profile-nickname"
          );
          if (actualUserDivs.length) {
            actualUser = actualUserDivs[0].innerHTML;
          }
          const actualUserPicDivs = document.getElementsByClassName(
            "user-interactions-profile-img"
          );
          if (actualUserPicDivs.length) {
            actualUserPic = actualUserPicDivs[0].src;
          }

          const message = {
            username: "DnDiscord",
            embeds: [
              {
                author: {
                  name: "",
                  icon_url: "",
                },
                title: "",
                description: "",
                fields: [],
                color: "",
                timestamp: new Date(),
                footer: {
                  icon_url: actualUserPic,
                  text: `From ${actualUser} on DnDBeyond`,
                },
              },
            ],
          };

          const characterNameDivs = document.getElementsByClassName(
            "ddbc-character-name"
          );
          if (characterNameDivs.length) {
            message.embeds[0].author.name = characterNameDivs[0].textContent;
          }

          const profilePicDivs = document.getElementsByClassName(
            "ddbc-character-avatar__portrait"
          );
          if (profilePicDivs.length) {
            message.avatarUrl = profilePicDivs[0].style.backgroundImage.split(
              '"'
            )[1];
            message.embeds[0].author.icon_url = profilePicDivs[0].style.backgroundImage.split(
              '"'
            )[1];
          }

          diceNotifications.forEach((diceNotification) => {
            console.log(notificationElement.childNodes);
            console.log(sentRolls);
            console.log(diceNotifications);
            sentRolls[diceNotification.id] = true;

            let rollDetail = "";
            const rollDetailDivs = diceNotification.getElementsByClassName(
              "dice_result__info__rolldetail"
            );
            if (rollDetailDivs.length) {
              rollDetail = rollDetailDivs[0].innerHTML;
            }

            let rollType = "";
            let rollTypeColor = "";
            const rollTypeDivs = diceNotification.getElementsByClassName(
              "dice_result__rolltype"
            );
            if (rollTypeDivs.length) {
              rollType = rollTypeDivs[0].innerHTML;
              console.log(rollTypeDivs);
              rollTypeColor = convertColor(
                window
                  .getComputedStyle(rollTypeDivs[0], null)
                  .getPropertyValue("color")
              );
              console.log(`Color: ${rollTypeColor}`);
            }

            let rollNotation = "";
            let rollNotationDivs = diceNotification.getElementsByClassName(
              "dice_result__info__dicenotation"
            );
            if (rollNotationDivs.length) {
              rollNotation = rollNotationDivs[0].innerHTML;
              message.embeds[0].fields.push({
                name: "Rolled",
                value: rollNotation,
              });
            }

            let rollBreakdown = "";
            let rollBreakdownDivs = diceNotification.getElementsByClassName(
              "dice_result__info__breakdown"
            );
            if (rollBreakdownDivs.length) {
              rollBreakdown = rollBreakdownDivs[0].innerHTML;
              message.embeds[0].fields.push({
                name: "Breakdown",
                value: rollBreakdown,
              });
            }

            let rollTotal = "";
            let rollTotalDivs = diceNotification.getElementsByClassName(
              "dice_result__total-result"
            );
            if (rollTotalDivs.length) {
              rollTotal = rollTotalDivs[0].innerHTML;
              message.embeds[0].fields.push({
                name: "TOTAL",
                value: `${rollTotal}`,
              });
            }

            let rollTotalHeader = "";
            let rollTotalHeaderColor = "";
            const rollTotalHeaderDivs = diceNotification.getElementsByClassName(
              "dice_result__total-header"
            );
            if (rollTotalHeaderDivs.length) {
              rollTotalHeader = rollTotalHeaderDivs[0].innerHTML;
              rollTotalHeaderColor = convertColor(
                window
                  .getComputedStyle(rollTotalHeaderDivs[0], null)
                  .getPropertyValue("color")
              );
            }

            message.embeds[0].title = `TOTAL: ${rollTotal}`;
            message.embeds[0].description = `${rollDetail.trim()} ${rollType} ${rollTotalHeader}`;
            message.embeds[0].color = rollTypeColor;

            console.log(message);

            chrome.runtime.sendMessage(
              { type: "sendRoll", message: message },
              function (response) {}
            );
          });
        }
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
