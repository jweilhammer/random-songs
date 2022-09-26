# Setup

Normal npm commands through the package.json will setup the project for local development.

Have been using Node 16.x for development, the React template I used doesn't seem to support 18+

Dependencies
```
npm install
```

Start dev server (does not use service-workers)
```
npm start
```


# Building

The normal npm command is used to create production builds
`npm run build`

Minified output is in the `build/` dir and the song data included is located in the public/ directory

NOTE:
The default `react-scripts build` is extended on so we can customize the Workbox service worker to cache our song data at runtime.

This uses the [rewire](package.json) npm package as a dev dependency and includes the customization in build.js

# Updating Songs

For updating songs locally, see [scripts/README.md](../scripts/README.md)