function log(msg) {
    document.getElementById("status").innerHTML += "<br>" + msg;
}

function showResult(title, result) {
    try {
        const output = typeof result === "string"
            ? result
            : JSON.stringify(result);

        log(title + ": " + output);
        console.log(title, result);

    } catch (e) {
        log(title + ": " + result);
        console.log(title, result);
    }
}

log("Initializing...");

if (!window.djiBridge) {

    log("❌ DJI Bridge not found");

} else {

    log("✅ DJI Bridge detected");

    try {

        // Verify license
        const licenseResult = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        showResult("License Result", licenseResult);

        // Aircraft SN
        try {
            showResult(
                "Aircraft SN",
                window.djiBridge.platformGetAircraftSN()
            );
        } catch (e) {
            showResult("Aircraft SN Error", e);
        }

        // RC SN
        try {
            showResult(
                "RC SN",
                window.djiBridge.platformGetRemoteControllerSN()
            );
        } catch (e) {
            showResult("RC SN Error", e);
        }

        // Platform Token
        try {
            showResult(
                "Platform Token",
                window.djiBridge.platformGetToken()
            );
        } catch (e) {
            showResult("Platform Token Error", e);
        }

        // API Host
        try {
            showResult(
                "API Host",
                window.djiBridge.apiGetHost()
            );
        } catch (e) {
            showResult("API Host Error", e);
        }

        // Thing State
        try {
            showResult(
                "Thing State",
                window.djiBridge.thingGetConnectState()
            );
        } catch (e) {
            showResult("Thing State Error", e);
        }

        // Thing Config
        try {
            showResult(
                "Thing Config",
                window.djiBridge.thingGetConfigs()
            );
        } catch (e) {
            showResult("Thing Config Error", e);
        }

        // WS State
        try {
            showResult(
                "WS State",
                window.djiBridge.wsGetConnectState()
            );
        } catch (e) {
            showResult("WS State Error", e);
        }

        // WS Config
        try {
            showResult(
                "WS Config",
                window.djiBridge.wsGetConfigs()
            );
        } catch (e) {
            showResult("WS Config Error", e);
        }

        // Version
        try {
            showResult(
                "Platform Version",
                window.djiBridge.platformGetVersion()
            );
        } catch (e) {
            showResult("Version Error", e);
        }

    } catch (err) {

        showResult("License Error", err);

    }
}