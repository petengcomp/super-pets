class Start extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  create() {
    if (music.key != "musicMenu") {
      music.stop();
      music = this.sound.add("musicMenu");
      music.play(gameSettings.music);
    }

    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-menu")
      .setOrigin(0, 0);

    this.buttonClick = this.sound.add("buttonClick");

    this.botaoStartSombra = this.add
      .bitmapText(204, 194, "AGoblinAppears", "JOGAR", 40)
      .setOrigin(0.25)
      .setTint(0x000000)
      .setAlpha(0.5);
    this.botaoStart = this.add
      .bitmapText(200, 190, "AGoblinAppears", "JOGAR", 40)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.25);

    this.botaoStart.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("EscolhaPersonagem");
    });
    this.botaoStart.on("pointerover", () => {
      this.botaoStart.setScale(1.3);
      this.botaoStartSombra.setScale(1.3);
    });
    this.botaoStart.on("pointerout", () => {
      this.botaoStart.setScale(1);
      this.botaoStartSombra.setScale(1);
    });

    this.botaoConfigSombra = this.add
      .bitmapText(224, 304, "AGoblinAppears", "CONFIG", 20)
      .setOrigin(0.25)
      .setTint(0x000000)
      .setAlpha(0.5);
    this.botaoConfig = this.add
      .bitmapText(220, 300, "AGoblinAppears", "CONFIG", 20)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.25);

    this.botaoConfig.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("Settings");
    });
    this.botaoConfig.on("pointerover", () => {
      this.botaoConfig.setScale(1.1);
      this.botaoConfigSombra.setScale(1.1);
    });
    this.botaoConfig.on("pointerout", () => {
      this.botaoConfig.setScale(1);
      this.botaoConfigSombra.setScale(1);
    });

    this.botaohHowToPlaySombra = this.add
      .bitmapText(204, 354, "AGoblinAppears", "COMO JOGAR", 20)
      .setOrigin(0.25)
      .setTint(0x000000)
      .setAlpha(0.5);
    this.botaohHowToPlay = this.add
      .bitmapText(200, 350, "AGoblinAppears", "COMO JOGAR", 20)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.25);

    this.botaohHowToPlay.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("HowToPlay");
    });
    this.botaohHowToPlay.on("pointerover", () => {
      this.botaohHowToPlay.setScale(1.1);
      this.botaohHowToPlaySombra.setScale(1.1);
    });
    this.botaohHowToPlay.on("pointerout", () => {
      this.botaohHowToPlay.setScale(1);
      this.botaohHowToPlaySombra.setScale(1);
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}
