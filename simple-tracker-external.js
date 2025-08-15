// 🔍 SIMPLE VISITOR TRACKER (External Access Version)
// This version is configured for external access using your IP address

(function() {
    // 🛠️ CONFIGURATION - For External Access
    // Your computer's IP addresses: 192.168.56.1 or 192.168.29.109
    // Use the one that works on your network (usually the 192.168.29.109)
    const SERVER_URL = 'http://[2405:201:500f:584d:8dfd:87c9:a456:286]:8080';  // 👈 Your IP address!
    
    // 📊 COLLECT VISITOR INFORMATION
    function collectVisitorData() {
        return {
            timestamp: new Date().toISOString(),
            currentPage: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer || 'Direct visit',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // 🗺️ Location information (will be added separately)
            locationRequested: true,
            locationData: null  // Will be populated by getLocation function
        };
    }
    
    // 🗺️ GET VISITOR'S LOCATION
    function getLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.log('🚫 Geolocation is not supported by this browser');
                resolve({
                    supported: false,
                    error: 'Geolocation not supported'
                });
                return;
            }
            
            // Request location with options
            const options = {
                enableHighAccuracy: true,  // Try to get the most accurate location
                timeout: 10000,           // Wait up to 10 seconds
                maximumAge: 300000        // Accept cached location up to 5 minutes old
            };
            
            navigator.geolocation.getCurrentPosition(
                // Success callback
                function(position) {
                    console.log('📍 Location obtained successfully');
                    resolve({
                        supported: true,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp
                    });
                },
                // Error callback
                function(error) {
                    console.log('❌ Location error:', error.message);
                    let errorMessage = 'Unknown error';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'User denied location access';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    resolve({
                        supported: true,
                        error: errorMessage,
                        errorCode: error.code
                    });
                },
                options
            );
        });
    }
    
    // 📡 SEND DATA TO SERVER
    function sendVisitorData(data) {
        fetch(`${SERVER_URL}/track-visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('✅ Visitor tracked successfully:', result);
        })
        .catch(error => {
            console.log('❌ Visitor tracking failed:', error);
            console.log('💡 Make sure your server is running and accessible at:', SERVER_URL);
        });
    }
    
    // 🚀 START TRACKING
    async function startTracking() {
        try {
            // Collect basic visitor information
            const visitorData = collectVisitorData();
            
            // Try to get location information
            console.log('🗺️ Requesting location information...');
            const locationData = await getLocation();
            visitorData.locationData = locationData;
            
            // Send to server
            sendVisitorData(visitorData);
            
            console.log('🔍 Visitor data sent to:', SERVER_URL);
            if (locationData.supported && !locationData.error) {
                console.log('📍 Location included:', locationData.latitude, locationData.longitude);
            } else {
                console.log('🚫 Location not available:', locationData.error || 'Not supported');
            }
        } catch (error) {
            console.log('❌ Error in visitor tracking:', error);
        }
    }
    
    // 🎯 INITIALIZE TRACKING
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTracking);
    } else {
        startTracking();
    }
    
    console.log('🔍 External visitor tracking initialized for:', SERVER_URL);
})();
