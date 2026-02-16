# kazagumo-deezer
A plugin that allows you to play music on deezer

Install
```
npm i kazagumo-deezer
```

Support source:
```
- https://www.deezer.com/us/playlist/53362031
- https://www.deezer.com/us/track/6745599
- https://www.deezer.com/us/album/103248
```
How to
```js
const { Kazagumo } = require('kazagumo');
const Deezer = require('kazagumo-deezer');

const kazagumo = new Kazagumo(
  {
    plugins: [
      new Deezer({
        playlistLimit: 20
      }),
    ],
  },
  new Connectors.DiscordJS(client),
  Nodes,
);

kazagumo.search(`https://www.deezer.com/us/playlist/53362031`); // track, album, playlist
kazagumo.search('mirror heart', { engine: 'deezer' }); // search track using deezer
```
