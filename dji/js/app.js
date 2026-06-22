function log(msg) {
    const el = document.getElementById("status");
    if (el) el.innerHTML += "<br>" + msg;
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
        console.log("License:", license);

        initThing();

    } catch (err) {

        log("❌ Init error: " + err);

    }
}

// =========================
// 🚁 THING MODULE
// =========================
function initThing() {

    log("📡 Loading Thing module...");

    try {

        window.djiBridge.platformLoadComponent(
            "thing",
            JSON.stringify({
                host: "tcp://broker.hivemq.com:1883",
                clientId: "apusfly_" + Date.now()
            })
        );

    } catch (err) {

        log("❌ Thing load error: " + err);

    }

    setTimeout(() => {

        try {

            const state =
                window.djiBridge.thingGetConnectState();

            log("📡 Thing state: " +
                JSON.stringify(state));

            console.log("THING RAW:", state);

        } catch (err) {

            log("❌ Thing state error: " + err);

        }

        initWS();

    }, 3000);
}

// =========================
// 🔌 WS MODULE
// =========================
function initWS() {

    log("🔌 Loading WS module...");

    try {

        window.djiBridge.platformLoadComponent(
            "ws",
            JSON.stringify({
                url: "wss://apus-fly.vercel.app/ws",
                token: window.djiBridge.platformGetToken()
            })
        );

    } catch (err) {

        log("❌ WS load error: " + err);

    }

    setTimeout(() => {

        try {

            const state =
                window.djiBridge.wsGetConnectState();

            log("🔌 WS state: " +
                JSON.stringify(state));

            console.log("WS RAW:", state);

        } catch (err) {

            log("❌ WS state error: " + err);

        }

        startTelemetry();

    }, 3000);
}

// =========================
// 📡 TELEMETRY SENDER
// =========================
function startTelemetry() {

    log("📡 Starting telemetry stream...");

    setInterval(() => {

        try {

            const aircraftRaw =
                window.djiBridge.platformGetAircraftSN();

            const rcRaw =
                window.djiBridge.platformGetRemoteControllerSN();

            console.log("AIRCRAFT RAW:", aircraftRaw);
            console.log("RC RAW:", rcRaw);

            log("🚁 Aircraft RAW: " +
                JSON.stringify(aircraftRaw));

            log("🎮 RC RAW: " +
                JSON.stringify(rcRaw));

            // Handle both object and JSON-string responses
            let aircraftSN = aircraftRaw;
            let rcSN = rcRaw;

            try {

                if (typeof aircraftRaw === "string") {
                    const parsed = JSON.parse(aircraftRaw);
                    aircraftSN = parsed.data || aircraftRaw;
                } else if (aircraftRaw?.data) {
                    aircraftSN = aircraftRaw.data;
                }

                if (typeof rcRaw === "string") {
                    const parsed = JSON.parse(rcRaw);
                    rcSN = parsed.data || rcRaw;
                } else if (rcRaw?.data) {
                    rcSN = rcRaw.data;
                }

            } catch (e) {

                console.log("Parse error:", e);

            }

            const payload = {

                drone_id: aircraftSN,
                rc_sn: rcSN,

                token:
                    window.djiBridge.platformGetToken(),

                thing_state:
                    window.djiBridge.thingGetConnectState(),

                ws_state:
                    window.djiBridge.wsGetConnectState(),

                api_host:
                    window.djiBridge.apiGetHost(),

                timestamp: Date.now()
            };

            console.log("FINAL PAYLOAD:", payload);

            log("📤 Sending telemetry...");

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

                log("✔ Sent: " +
                    JSON.stringify(data));

            })
            .catch(err => {

                log("❌ Send error: " + err);

            });

        } catch (err) {

            log("❌ Telemetry error: " + err);

        }

    }, 3000);
}