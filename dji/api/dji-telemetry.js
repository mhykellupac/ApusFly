export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "POST only" });
    }

    try {
        const data = req.body;

        // =========================
        // 🧪 FULL DEBUG LOGGING
        // =========================
        console.log("===== DJI TELEMETRY RECEIVED =====");
        console.log("RAW DATA:", JSON.stringify(data, null, 2));
        console.log("LAT:", data?.latitude);
        console.log("LNG:", data?.longitude);
        console.log("DEVICE:", data?.device_sn);
        console.log("ALT:", data?.altitude);
        console.log("BATTERY:", data?.battery);
        console.log("TIME:", new Date().toISOString());
        console.log("===================================");

        // =========================
        // 🚨 BASIC VALIDATION
        // =========================
        if (!data || typeof data !== "object") {
            throw new Error("Invalid telemetry payload");
        }

        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        // Detect invalid GPS
        const isValidGPS =
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat !== 0 &&
            lng !== 0 &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180;

        if (!isValidGPS) {
            console.warn("⚠️ INVALID GPS DETECTED:", { lat, lng });

            return res.status(200).json({
                success: false,
                message: "Invalid GPS data received",
                raw: data
            });
        }

        // =========================
        // 📦 CLEAN PAYLOAD
        // =========================
        const payload = {
            drone_id: data.device_sn || data.drone_id || "unknown",
            lat,
            lng,
            altitude: data.altitude ?? null,
            speed: data.speed ?? null,
            battery: data.battery ?? null,
            status: data.status || "flying",
            timestamp: Date.now()
        };

        console.log("CLEAN PAYLOAD:", payload);

        // =========================
        // 🚀 FORWARD TO MQTT
        // =========================
        const response = await fetch(
            "https://apusfly-mqtt-bridge.onrender.com/publish",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: "apusfly/drone/telemetry",
                    message: JSON.stringify(payload)
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("MQTT bridge error:", errorText);

            return res.status(500).json({
                success: false,
                message: "MQTT bridge failed",
                error: errorText
            });
        }

        // =========================
        // ✅ SUCCESS RESPONSE
        // =========================
        return res.status(200).json({
            success: true,
            message: "Telemetry forwarded to MQTT",
            payload
        });

    } catch (err) {
        console.error("DJI TELEMETRY ERROR:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}