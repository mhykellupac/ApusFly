function log(msg) {
    const el = document.getElementById("status");
    if (el) {
        el.innerHTML += "<br>" + msg;
    }

    console.log(msg);
}

log("🚀 DJI App Starting...");

if (!window.djiBridge) {

    log("❌ DJI Bridge not found");

} else {

    log("✅ DJI Bridge detected");

    try {

        const license = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        log("✔ License verified");
        console.log("LICENSE:", license);

        // =========================
        // TOKEN
        // =========================
        try {

            const token =
                window.djiBridge.platformGetToken();

            log("🔑 Token Retrieved");

            console.log("TOKEN:", token);

        } catch (err) {

            log("❌ Token Error: " + err);

        }

        // =========================
        // API HOST
        // =========================
        try {

            const host =
                window.djiBridge.apiGetHost();

            log("🌐 API Host Retrieved");

            console.log("API HOST:", host);

        } catch (err) {

            log("❌ API Host Error: " + err);

        }

        initThing();

    } catch (err) {

        log("❌ Init error: " + err);
        console.error(err);

    }
}

// =========================
// 🚁 THING MODULE DEBUG
// =========================
function initThing() {

    log("📡 Checking Thing module...");

    try {

        const thingConfig =
            window.djiBridge.thingGetConfigs();

        console.log("THING CONFIG:", thingConfig);

        log("📄 Thing Config:");
        log(JSON.stringify(thingConfig));

    } catch (err) {

        log("❌ Thing Config Error: " + err);

    }

    try {

        const thingState =
            window.djiBridge.thingGetConnectState();

        console.log("THING STATE:", thingState);

        log("📡 Thing State:");
        log(JSON.stringify(thingState));

    } catch (err) {

        log("❌ Thing State Error: " + err);

    }

    initWS();
}

// =========================
// 🔌 WS MODULE DEBUG
// =========================
function initWS() {

    log("🔌 Checking WS module...");

    try {

        const wsConfig =
            window.djiBridge.wsGetConfigs();

        console.log("WS CONFIG:", wsConfig);

        log("📄 WS Config:");
        log(JSON.stringify(wsConfig));

    } catch (err) {

        log("❌ WS Config Error: " + err);

    }

    try {

        const wsState =
            window.djiBridge.wsGetConnectState();

        console.log("WS STATE:", wsState);

        log("🔌 WS State:");
        log(JSON.stringify(wsState));

    } catch (err) {

        log("❌ WS State Error: " + err);

    }

    startTelemetry();
}

// =========================
// SERIAL NUMBER PARSER
// =========================
function extractData(raw) {

    try {

        if (typeof raw === "string") {

            const parsed = JSON.parse(raw);

            return parsed.data || raw;
        }

        if (raw && raw.data) {
            return raw.data;
        }

        return raw;

    } catch (err) {

        return raw;

    }
}

// =========================
// TELEMETRY LOOP
// =========================
function startTelemetry() {

    log("📡 Starting telemetry stream...");

    setInterval(() => {

        try {

            const aircraftRaw =
                window.djiBridge.platformGetAircraftSN();

            const rcRaw =
                window.djiBridge.platformGetRemoteControllerSN();

            const aircraftSN =
                extractData(aircraftRaw);

            const rcSN =
                extractData(rcRaw);

            console.log("AIRCRAFT RAW:", aircraftRaw);
            console.log("RC RAW:", rcRaw);

            console.log("AIRCRAFT SN:", aircraftSN);
            console.log("RC SN:", rcSN);

            const payload = {

                drone_id: aircraftSN,
                rc_sn: rcSN,

                thing_state:
                    window.djiBridge.thingGetConnectState(),

                ws_state:
                    window.djiBridge.wsGetConnectState(),

                timestamp: Date.now()
            };

            console.log("FINAL PAYLOAD:", payload);

            fetch(
                "https://apus-fly.vercel.app/api/dji-telemetry",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            )
            .then(r => r.json())
            .then(data => {

                console.log("API RESPONSE:", data);

            })
            .catch(err => {

                console.error("SEND ERROR:", err);

            });

        } catch (err) {

            log("❌ Telemetry Error: " + err);
            console.error(err);

        }

    }, 3000);
}