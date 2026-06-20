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

    log("✔ DJI Bridge detected");

    try {

        const result = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        log("License result: " + result);

        // ===============================
        // BRIDGE DEBUG
        // ===============================
        console.log("DJI BRIDGE OBJECT:", window.djiBridge);

        const methods = Object.keys(window.djiBridge);

        log("✅ Found " + methods.length + " bridge methods");

        methods.forEach((method, index) => {
            console.log("DJI METHOD:", method);
        });

        // ===============================
        // AIRCRAFT SERIAL NUMBER
        // ===============================
        try {

            const aircraftSN =
                window.djiBridge.platformGetAircraftSN();

            log("🚁 Aircraft SN: " + aircraftSN);

            console.log("AIRCRAFT SN:", aircraftSN);

        } catch (err) {

            log("❌ Aircraft SN Error");
            console.error("AIRCRAFT SN ERROR:", err);

        }

        // ===============================
        // THING CONNECTION STATE
        // ===============================
        try {

            const thingState =
                window.djiBridge.thingGetConnectState();

            log("📡 Thing State: " + thingState);

            console.log("THING STATE:", thingState);

        } catch (err) {

            log("❌ Thing State Error");
            console.error("THING STATE ERROR:", err);

        }

        // ===============================
        // THING CONFIG
        // ===============================
        try {

            const thingConfig =
                window.djiBridge.thingGetConfigs();

            log("📋 Thing Config Loaded");

            console.log("THING CONFIG:", thingConfig);

            // Optional: show on page
            log("Thing Config:");
            log(JSON.stringify(thingConfig));

        } catch (err) {

            log("❌ Thing Config Error");
            console.error("THING CONFIG ERROR:", err);

        }

        // ===============================
        // PLATFORM INFO
        // ===============================
        try {

            const version =
                window.djiBridge.platformGetVersion();

            log("📦 Platform Version: " + version);

            console.log("PLATFORM VERSION:", version);

        } catch (err) {

            console.error("VERSION ERROR:", err);

        }

    } catch (err) {

        log("❌ License error: " + err);
        console.error("LICENSE ERROR:", err);

    }
}