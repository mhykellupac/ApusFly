function log(msg) {
    document.getElementById("status").innerHTML += "<br>" + msg;
}

log("Page loaded");

// ===============================
// DJI BRIDGE CHECK
// ===============================
if (!window.djiBridge) {

    log("❌ DJI Bridge not found");
    console.error("DJI Bridge not found");

} else {

    log("✔️ DJI Bridge detected");

    try {

        const result = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        log("✔️ License result: " + JSON.stringify(result));
        console.log("LICENSE RESULT:", result);

        // ===============================
        // BRIDGE METHODS
        // ===============================
        const methods = Object.keys(window.djiBridge);

        log("✔️ Found " + methods.length + " bridge methods");

        console.log("DJI METHODS:", methods);

        // ===============================
        // AIRCRAFT SN
        // ===============================
        try {

            const aircraftSN =
                window.djiBridge.platformGetAircraftSN();

            log("🚁 Aircraft SN: " +
                JSON.stringify(aircraftSN));

            console.log(
                "AIRCRAFT SN:",
                aircraftSN
            );

        } catch (err) {

            log("❌ Aircraft SN Error: " + err);
            console.error(err);

        }

        // ===============================
        // API HOST
        // ===============================
        try {

            const apiHost =
                window.djiBridge.apiGetHost();

            log("🌐 API Host: " +
                JSON.stringify(apiHost));

            console.log(
                "API HOST:",
                apiHost
            );

        } catch (err) {

            log("❌ API Host Error: " + err);
            console.error(err);

        }

        // ===============================
        // API TOKEN
        // ===============================
        try {

            const token =
                window.djiBridge.apiGetToken();

            log("🔑 API Token Result Received");

            console.log(
                "API TOKEN:",
                token
            );

        } catch (err) {

            log("❌ API Token Error: " + err);
            console.error(err);

        }

        // ===============================
        // THING STATE
        // ===============================
        try {

            const thingState =
                window.djiBridge.thingGetConnectState();

            log("📡 Thing State: " +
                JSON.stringify(thingState));

            console.log(
                "THING STATE:",
                thingState
            );

        } catch (err) {

            log("❌ Thing State Error: " + err);
            console.error(err);

        }

        // ===============================
        // THING CONFIG
        // ===============================
        try {

            const thingConfig =
                window.djiBridge.thingGetConfigs();

            log("📄 Thing Config Retrieved");

            console.log(
                "THING CONFIG:",
                thingConfig
            );

        } catch (err) {

            log("❌ Thing Config Error: " + err);
            console.error(err);

        }

        // ===============================
        // WS STATE
        // ===============================
        try {

            const wsState =
                window.djiBridge.wsGetConnectState();

            log("🔌 WS State: " +
                JSON.stringify(wsState));

            console.log(
                "WS STATE:",
                wsState
            );

        } catch (err) {

            log("❌ WS State Error: " + err);
            console.error(err);

        }

        // ===============================
        // WS CONFIG
        // ===============================
        try {

            const wsConfig =
                window.djiBridge.wsGetConfigs();

            log("📄 WS Config Retrieved");

            console.log(
                "WS CONFIG:",
                wsConfig
            );

        } catch (err) {

            log("❌ WS Config Error: " + err);
            console.error(err);

        }

        // ===============================
        // PLATFORM VERSION
        // ===============================
        try {

            const version =
                window.djiBridge.platformGetVersion();

            log("📦 Platform Version Retrieved");

            console.log(
                "PLATFORM VERSION:",
                version
            );

        } catch (err) {

            log("❌ Version Error: " + err);
            console.error(err);

        }

    } catch (err) {

        log("❌ License error: " + err);
        console.error(err);

    }
}