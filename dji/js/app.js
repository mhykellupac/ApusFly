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
        // =========================
        // LICENSE CHECK
        // =========================
        const license = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        log("✔ License verified");
        console.log("License:", license);

        // =========================
        // START DJI CLOUD INIT
        // =========================
        initThing();

    } catch (err) {
        log("❌ Init error: " + err);
    }
}

// =========================
// 🚁 THING MODULE (REQUIRED)
// =========================
function initThing() {

    log("📡 Loading Thing module...");

    window.djiBridge.platformLoadComponent(
        "thing",
        JSON.stringify({
            host: "tcp://broker.hivemq.com:1883",
            clientId: "apusfly_" + Date.now()
        })
    );

    setTimeout(() => {

        const state = window.djiBridge.thingGetConnectState();
        log("📡 Thing state: " + JSON.stringify(state));

        initWS();

    }, 3000);
}

// =========================
// 🔌 WS MODULE (REQUIRED)
// =========================
function initWS() {

    log("🔌 Loading WS module...");

    window.djiBridge.platformLoadComponent(
        "ws",
        JSON.stringify({
            url: "wss://apus-fly.vercel.app/ws",
            token: window.djiBridge.platformGetToken()
        })
    );

    setTimeout(() => {

        const state = window.djiBridge.wsGetConnectState();
        log("🔌 WS state: " + JSON.stringify(state));

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

            const payload = {
                drone_id: window.djiBridge.platformGetAircraftSN(),
                rc_sn: window.djiBridge.platformGetRemoteControllerSN(),
                token: window.djiBridge.platformGetToken(),

                thing_state: window.djiBridge.thingGetConnectState(),
                ws_state: window.djiBridge.wsGetConnectState(),

                api_host: window.djiBridge.apiGetHost(),
                timestamp: Date.now()
            };

            log("📤 Sending telemetry...");

            fetch("https://apus-fly.vercel.app/api/dji-telemetry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(r => r.json())
            .then(data => {
                log("✔ Sent: " + JSON.stringify(data));
            })
            .catch(err => {
                log("❌ Send error: " + err);
            });

        } catch (err) {
            log("❌ Telemetry error: " + err);
        }

    }, 3000);
}