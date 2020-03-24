export function showDesktopNotification(message = '') {
    if (!message) return;
    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}