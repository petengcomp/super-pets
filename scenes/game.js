var gameSettings = {
  playerSpeed: 150,
  soundFx: {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0,
  },
  music: {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
  },
};

var music;

var config = {
  width: 500,
  height: 400,
  backgroundColor: 0x000000,

  scene: [
    Load,
    Start,
    SelectCharacter,
    SelectLevel,
    Fases,
    Settings,
    HowToPlay,
  ],
  parent: "mygame",
  pixelArt: true,
  scale: {
    zoom: 1.5,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
const eventsCenter = new Phaser.Events.EventEmitter();
