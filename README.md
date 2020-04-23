## Webtorrent-browser

Pre-alpha build.

### Installation

`npm install` - to install dev dependencies

`npm run dev` - to run in dev mode

`npm run build` - build in dist folder
    
### Technologies
* React, redux
* WebTorrent API
* MaterialUI API
* IndexedDB and it's enhanced versions
* Drag-Drop API

### Current Features

* User can upload/download/delete torrents and observe their current status(speed, seeds, size)
* User can see and change an amount of dedicated disk space for the torrents
* All the information is stored in advanced version IndexDB(with no localStorage space restrictions etc.).
It is achieved through separate table, which stores meta-information.
* All the downloads/uploads are sustainable to page reloads

*Inportant note:* due to very specific behavoir of the torrents list (is received from WebTorrent API), which updates automatically, but not invokes redux state change, page refreshment is controlled manually via optimized setInterval function.
