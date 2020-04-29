## Webtorrent-browser

Pre-alpha build.

### Installation

`npm install` - to install dev dependencies

`npm run electron` - build an electron app
    
### Technologies
* React, redux
* WebTorrent API
* MaterialUI API
* IndexedDB and it's enhanced versions
* Drag-Drop API *(currently unavaliliable)*

* Electron(only in dev mode)

### Current Features

* User can upload/download/delete torrents and observe their current status(speed, seeds, size)
* User can see and change an amount of dedicated disk space for the torrents
* All the information is stored in user's disk storage.
* All the downloads/uploads are sustainable to page reloads
* User can watch torrents in stream mode: *'.mp4', '.mp3', '.webm', '.m4v', '.m4a', '.wav'*

* Electron-app support (currently only in dev mode)

*Inportant note:* due to very specific behavoir of the torrents list (is received from WebTorrent API), which updates automatically, but not invokes redux state change, page refreshment is controlled manually via optimized setInterval function.
