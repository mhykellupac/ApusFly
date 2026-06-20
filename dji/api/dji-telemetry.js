export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "POST only" });
    }

    try {

        const data = req.body;

        console.log("===== DJI TELEMETRY RECEIVED =====");
        console.log(JSON.stringify(data, null, 2));

        if (!data || typeof data !== "object") {
            throw new Error("Invalid payload");
        }

        // IMPORTANT: we no longer depend on GPS (because DJI is not sending it yet)
        const payload = {
            drone_id: data.drone_id || "unknown",
            rc_sn: data.rc_sn || null,
            status: "active",
            timestamp: Date.now()
        };

        console.log("CLEAN PAYLOAD:", payload);

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
            const errText = await response.text();
            return res.status(500).json({
                success: false,
                error: errText
            });
        }

        return res.status(200).json({
            success: true,
            message: "Forwarded to MQTT",
            payload
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}