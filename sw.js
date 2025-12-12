// Empty service worker - placeholder to prevent 404 errors
// This file can be removed if no PWA functionality is needed

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
