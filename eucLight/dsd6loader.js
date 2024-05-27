/* BLE debug info */
Puck.debug = 3;
/* Are we only putting a single app on a device? If so
apps should all be saved as .bootcde and we write info
about the current app into app.info */
Const.SINGLE_APP_ONLY = false;

if (window.location.host=="espruino.com") {
  document.getElementById("apploaderlinks").innerHTML =
    'This is the official Espruino App Loader - you can also try the <a href="https://espruino.github.io/EspruinoApps/">Development Version</a> for the most recent apps.';
} else if (window.location.host=="espruino.github.io") {
  document.title += " [Development]";
  document.getElementById("apploaderlinks").innerHTML =
    'This is the development Espruino App Loader - you can also try the <a href="https://espruino.com/apps/">Official Version</a> for stable apps.';
} else {
  document.title += " [Unofficial]";
  document.getElementById("apploaderlinks").innerHTML =
    'This is not the <a href="https://espruino.com/apps/">official Espruino App Loader</a>.';
}

var APP_SOURCECODE_URL;
var APP_SOURCECODE_DEV;
(function() {
  let username = "enaon";
  let githubMatch = window.location.href.match(/\/(\w+)\.github\.io/);
  if (githubMatch) username = githubMatch[1];
  APP_SOURCECODE_URL = `https://github.com/${username}/eucWatch/tree/main/DSD6/`;
  APP_SOURCECODE_DEV = `DSD6`;
})();

const DEVICEINFO = {
  "PUCKJS" : {
    features : ["BLE","BLEHID","NFC"]
  },
  "MDBT42Q" : {
    features : ["BLE","BLEHID"]
  },
  "PIXLJS" : {
    features : ["BLE","BLEHID","NFC","GRAPHICS"]
  }
};
