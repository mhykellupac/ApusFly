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

        showResult("License", license);

        startTelemetry();

    } catch (err) {
        showResult("Init Error", err);
    }
}

// ===============================
// 🚁 TELEMETRY SENDER (FIXED)
// ===============================
function startTelemetry() {

    log("📡 Starting telemetry stream...");

    setInterval(() => {

        try {

            const payload = {
                device_sn: window.djiBridge.platformGetAircraftSN(),
                rc_sn: window.djiBridge.platformGetRemoteControllerSN(),
                token: window.djiBridge.platformGetToken(),

                // 🚨 ADD THESE (IMPORTANT FIX)
                latitude: window.djiBridge.platformGetAircraftLocation?.()?.latitude || null,
                longitude: window.djiBridge.platformGetAircraftLocation?.()?.longitude || null,
                altitude: window.djiBridge.platformGetAircraftAltitude?.() || null,
                battery: window.djiBridge.platformGetBatteryLevel?.() || null,

                status: "flying",
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
            .then(res => res.json())
            .then(data => {
                showResult("Telemetry Response", data);
            })
            .catch(err => {
                showResult("Fetch Error", err);
            });

        } catch (err) {
            showResult("Telemetry Error", err);
        }

    }, 2000);
}