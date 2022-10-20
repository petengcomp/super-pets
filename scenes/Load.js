class Load extends Phaser.Scene {
  constructor() {
    super("Load");
  }

  preload() {
    //Faz o carregamento de todas as sprites e animações que serão utilizadas aqui
    this.load.image("background-menu", "assets/fundo-selecao-nivel.png");
    this.load.image("background-jogo", "assets/fundo-jogo2.png");
    this.load.image("fundoPause", "assets/telapreta.jpg");

    this.load.image("peixe", "assets/peixe.png");
    this.load.image("osso", "assets/osso.png");

    this.load.image("sol", "assets/sol.png");

    this.load.image("level1", "assets/urano.png");
    this.load.image("level2", "assets/saturno.png");
    this.load.image("level3", "assets/jupiter.png");
    this.load.image("level4", "assets/marte.png");
    this.load.image("level5", "assets/lua.png");
    this.load.image("level6", "assets/terra.png");

    this.load.image("space_background", "assets/space_background.png");
    this.load.image("shot", "assets/shot.png");
    this.load.image("naveFacil", "assets/nave1.png");
    this.load.image("naveDificil", "assets/nave2.png");

    this.load.image("keys", "assets/keys.png");
    this.load.image("mouse", "assets/mouse.png");

    this.load.image("pause", "assets/pause.png");

    this.load.image("arrowL", "assets/arrowL.png");
    this.load.image("arrowR", "assets/arrowR.png");
    this.load.image("rectangle", "assets/rectangle.png");

    this.load.spritesheet("naveCachorro", "assets/navecachorroteste.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("naveGato", "assets/navegatoteste.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("cachorro_parado", "assets/cachorro-Sheet.png", {
      frameWidth: 96,
      frameHeight: 96,
    });

    this.load.spritesheet("gato_parado", "assets/gato-Sheet.png", {
      frameWidth: 96,
      frameHeight: 96,
    });

    this.load.spritesheet("sol-animado", "assets/sol-animacao-sheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.bitmapFont(
      "AGoblinAppears",
      "assets/font/AGoblinAppears.png",
      "assets/font/AGoblinAppears.xml"
    );

    this.load.audio(
      "musicMenu",
      "assets/sounds/Brave Pilots (Menu Screen).ogg"
    );
    this.load.audio("musicFase1", "assets/sounds/Alone Against Enemy.ogg");
    this.load.audio("musicFase2", "assets/sounds/Battle in the Stars.ogg");
    this.load.audio("musicFase3", "assets/sounds/Rain of Lasers.ogg");
    this.load.audio("musicFase4", "assets/sounds/Space Heroes.ogg");
    this.load.audio("musicFase5", "assets/sounds/Without Fear.ogg");
    this.load.audio("musicFase6", "assets/sounds/Epic End.ogg");
    this.load.audio("buttonClick", [
      "assets/sounds/button.ogg",
      "assets/sounds/button.mp3",
    ]);
    this.load.audio("cat", ["assets/sounds/cat.ogg", "assets/sounds/cat.mp3"]);
    this.load.audio("dog", ["assets/sounds/dog.ogg", "assets/sounds/dog.mp3"]);
    this.load.audio("explosion", [
      "assets/sounds/explosion.ogg",
      "assets/sounds/explosion.mp3",
    ]);
    this.load.audio("shot", [
      "assets/sounds/shot.ogg",
      "assets/sounds/shot.mp3",
    ]);
    this.load.audio("powerUpSound", [
      "assets/sounds/powerUp.ogg",
      "assets/sounds/powerUp.mp3",
    ]);
    this.load.audio("deathSound", [
      "assets/sounds/death.ogg",
      "assets/sounds/death.mp3",
    ]);
  }

  create() {
    this.anims.create({
      key: "cachorro_idle",
      frames: this.anims.generateFrameNumbers("cachorro_parado"),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "gato_idle",
      frames: this.anims.generateFrameNumbers("gato_parado"),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "cachorro-fly",
      frames: this.anims.generateFrameNumbers("naveCachorro"),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "gato-fly",
      frames: this.anims.generateFrameNumbers("naveGato"),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "sun",
      frames: this.anims.generateFrameNumbers("sol-animado"),
      frameRate: 1,
      repeat: -1,
    });

    this.scene.start("bootGame");

    if (!music) {
      music = this.sound.add("musicMenu");
      music.play(gameSettings.music);
    }
  }
}
