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
        // DJI BRIDGE DEBUG
        // ===============================
        log("<hr>");
        log("🔍 Inspecting DJI Bridge...");

        console.log("DJI BRIDGE OBJECT:", window.djiBridge);

        const methods = Object.keys(window.djiBridge);

        log("✅ Found " + methods.length + " bridge methods");
        log("<hr>");

        methods.forEach((method, index) => {

            // Show on page
            log((index + 1) + ". " + method);

            // Show in console
            console.log("DJI METHOD:", method);

        });

        // Extra debug info
        console.log("ALL DJI METHODS:", methods);

        log("<hr>");
        log("📋 Method list complete");

    } catch (err) {

        log("❌ License error: " + err);
        console.error("License error:", err);

    }
}