export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "POST only" });
    }

    try {
        const data = req.body;

        console.log("DJI LIVE DATA:", data);

        // Build clean telemetry payload
        const payload = {
            drone_id: data.device_sn || data.drone_id,
            lat: data.latitude,
            lng: data.longitude,
            altitude: data.altitude,
            speed: data.speed,
            battery: data.battery,
            status: data.status || "flying",
            timestamp: Date.now()
        };

        // Forward to MQTT bridge
        const response = await fetch("https://apusfly-mqtt-bridge.onrender.com/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                topic: "apusfly/drone/telemetry",
                message: JSON.stringify(payload)
            })
        });

        // Check if MQTT bridge succeeded
        if (!response.ok) {
            const errorText = await response.text();
            console.error("MQTT bridge error:", errorText);

            return res.status(500).json({
                success: false,
                message: "MQTT bridge failed",
                error: errorText
            });
        }

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