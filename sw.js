const cacheName = 'cache-v1';
const appInterfaz = [
    '/',
    'index.html',
    'styles/style.css',
    'main.js',
    'manifest.json',
    'browserconfig.xml',
    'sw.js',
    '.vscode/settings.json',
    'img/fondo/fondo.png',
    'img/logo/logo.png',
    'img/logo/logo2.png',
    'icons/android-icon-36x36.png ',
    'icons/android-icon-48x48.png',
    'icons/android-icon-72x72.png',
    'icons/android-icon-96x96.png',
    'icons/android-icon-144x144.png',
    'icons/android-icon-192x192.png',
    'icons/apple-icon-57x57.png',
    'icons/apple-icon-60x60.png',
    'icons/apple-icon-72x72.png',
    'icons/apple-icon-76x76.png',
    'icons/apple-icon-114x114.png',
    'icons/apple-icon-120x120.png',
    'icons/apple-icon-144x144.png',
    'icons/apple-icon-152x152.png',
    'icons/apple-icon-180x180.png',
    'icons/apple-icon-precomposed.png',
    'icons/apple-icon.png',
    'icons/favicon-16x16.png',
    'icons/favicon-32x32.png',
    'icons/favicon-96x96.png',
    'icons/favicon.ico',
    'icons/ms-icon-70x70.png',
    'icons/ms-icon-144x144.png',
    'icons/ms-icon-150x150.png',
    'icons/ms-icon-310x310.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js'

]
//cuando se instala
self.addEventListener('install', (evento)=> {
    const cache = caches.open(cacheName).then( cache => {
        console.log(cache);
        return cache.addAll( appInterfaz )
    })
    evento.waitUntil(cache);
})

self.addEventListener('activate', (evento)=> {
    console.log('sw activado');
})

self.addEventListener('fetch', (evento) =>{
    const respCache = caches.match(evento.request).then (res => {
        if(res){
            return res;
        } else {
            return fetch(evento.request).then(respNet => {
                return respNet
            })
        }
    })
    
    //console.log(respCache )
    evento.respondWith(respCache);
})