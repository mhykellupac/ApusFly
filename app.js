function log(msg){
    document.getElementById("status").innerHTML += "<br>" + msg;
}

log("Page loaded");

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

        // NEXT STEP AFTER THIS:
        // load cloud module (MQTT setup happens here)

    } catch (err) {
        log("License error: " + err);
    }
}