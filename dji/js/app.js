function log(msg){
    document.getElementById("status").innerHTML += "<br>" + msg;
}

log("Page loaded");

// ===============================
// 🚁 TELEMETRY STREAM FUNCTION
// ===============================
function startTelemetryStream() {

    log("🚀 Starting telemetry stream...");

    setInterval(() => {

        // ⚠️ TEST DATA (replace later with real DJI SDK values)
        const telemetry = {
            device_sn: "DJI-TEST-001",
            latitude: 14.5547 + Math.random() * 0.001,
            longitude: 121.0244 + Math.random() * 0.001,
            altitude: 120,
            speed: 5,
            battery: Math.floor(Math.random() * 100),
            status: "flying"
        };

        fetch("https://apus-fly.vercel.app/api/dji-telemetry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(telemetry)
        })
        .then(res => res.json())
        .then(data => {
            log("📡 Sent telemetry ✔");
        })
        .catch(err => {
            log("❌ Send failed: " + err);
        });

    }, 2000);
}

// ===============================
// 🚁 DJI BRIDGE CHECK
// ===============================
if (!window.djiBridge) {
    log("❌ DJI Bridge not found");
} else {
    log("✔ DJI Bridge detected");

    try {
        const result = window.djiBridge.platformVerifyLicense(
            DJI_CONFIG.APP_ID,
            DJI_CONFIG.APP_KEY,
            DJI_CONFIG.LICENSE
        );

        log("License result: " + result);

        // 🚀 START TELEMETRY AFTER SUCCESS
        startTelemetryStream();

    } catch (err) {
        log("License error: " + err);
    }
}