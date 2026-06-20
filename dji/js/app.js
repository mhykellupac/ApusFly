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

        log("License result: " + JSON.stringify(result));

        // ===============================
        // BRIDGE METHODS
        // ===============================
        const methods = Object.keys(window.djiBridge);

        log("✅ Found " + methods.length + " bridge methods");

        methods.forEach((method) => {
            console.log("DJI METHOD:", method);
        });

        // ===============================
        // AIRCRAFT SN
        // ===============================
        try {

            const aircraftSN =
                window.djiBridge.platformGetAircraftSN();

            log("🚁 Aircraft SN: " + JSON.stringify(aircraftSN));

            console.log("AIRCRAFT SN:", aircraftSN);

        } catch (err) {

            log("❌ Aircraft SN Error");
            console.error(err);

        }

        // ===============================
        // LOAD THING COMPONENT
        // ===============================
        try {

            log("🔄 Loading Thing Component...");

            const loadThingResult =
                window.djiBridge.platformLoadComponent("thing");

            log("Thing Load Result: " +
                JSON.stringify(loadThingResult));

            console.log(
                "THING LOAD RESULT:",
                loadThingResult
            );

        } catch (err) {

            log("❌ Thing Load Error: " + err);
            console.error("THING LOAD ERROR:", err);

        }

        // ===============================
        // CHECK THING STATUS AFTER LOAD
        // ===============================
        setTimeout(() => {

            try {

                const thingState =
                    window.djiBridge.thingGetConnectState();

                log(
                    "📡 Thing State After Load: " +
                    JSON.stringify(thingState)
                );

                console.log(
                    "THING STATE AFTER LOAD:",
                    thingState
                );

            } catch (err) {

                log("❌ Thing State Error: " + err);
                console.error(err);

            }

            try {

                const thingConfig =
                    window.djiBridge.thingGetConfigs();

                log(
                    "📋 Thing Config After Load: " +
                    JSON.stringify(thingConfig)
                );

                console.log(
                    "THING CONFIG AFTER LOAD:",
                    thingConfig
                );

            } catch (err) {

                log("❌ Thing Config Error: " + err);
                console.error(err);

            }

        }, 3000);

        // ===============================
        // PLATFORM VERSION
        // ===============================
        try {

            const version =
                window.djiBridge.platformGetVersion();

            log(
                "📦 Platform Version: " +
                JSON.stringify(version)
            );

            console.log("PLATFORM VERSION:", version);

        } catch (err) {

            console.error(err);

        }

    } catch (err) {

        log("❌ License error: " + err);
        console.error(err);

    }
}