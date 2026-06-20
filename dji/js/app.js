function log(msg) {
    document.getElementById("status").innerHTML += "<br>" + msg;
}

log("Page loaded");

// ===============================
// DJI BRIDGE CHECK
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

        // Debug: show available DJI Bridge functions
        log("Inspecting DJI Bridge...");
        console.log("DJI BRIDGE:", window.djiBridge);

        const methods = Object.keys(window.djiBridge);

        log("Found " + methods.length + " bridge methods");

        methods.forEach(method => {
            console.log("DJI METHOD:", method);
        });

    } catch (err) {
        log("License error: " + err);
        console.error(err);
    }
}