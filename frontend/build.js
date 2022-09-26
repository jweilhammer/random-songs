// Used to customize Webpack config without ejecting from create-react-app
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Find the GenerateSW config to add a runtime cache for our song-data
// This will generate caching logic in build output (service-worker.js)
for (const plugin of config.plugins) {
    if (plugin.config && Object.keys(plugin.config).includes("swDest")) {
        plugin.config.runtimeCaching = [{
            urlPattern: '/songs.json',
            // Use default handler to serve from cache when available and update in background
            // Just in case bad responses get out there, don't want to cache them for too long
            handler: 'StaleWhileRevalidate',

            // For use with the 'CacheFirst' strategy
            // TODO: Enable this when can guarentee 404 on React route
            // options: {
            //   cacheName: 'song-data',
            //   // Expire songs after 1 day
            //   // Client will only hit Network for songs once per day
            //   expiration: {
            //     maxAgeSeconds: 24 * 60 * 60,
            //   },
            // },
          },
          // For github-pages deployment
          {
            urlPattern: '/random-songs/songs.json',
            handler: 'StaleWhileRevalidate',
          }
        ]
    }
}