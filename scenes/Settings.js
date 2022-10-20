class Settings extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-menu")
      .setOrigin(0, 0);

    this.buttonClick = this.sound.add("buttonClick");

    this.efxTitle = this.add
      .bitmapText(
        config.width / 2,
        config.height / 2 - 125,
        "AGoblinAppears",
        "EFEITOS",
        20
      )
      .setOrigin(0.5);

    this.arrows = this.add.group();

    this.arrows.add(
      this.add.image(config.width / 2 - 154, config.height / 2 - 75, "arrowL")
    );
    this.arrows.add(
      this.add.image(config.width / 2 + 154, config.height / 2 - 75, "arrowR")
    );

    this.rectanglesFx = this.add.group();
    this.renderFx();

    this.musicTitle = this.add
      .bitmapText(
        config.width / 2,
        config.height / 2,
        "AGoblinAppears",
        "MUSICA",
        20
      )
      .setOrigin(0.5);

    this.arrows.add(
      this.add.image(config.width / 2 - 154, config.height / 2 + 50, "arrowL")
    );
    this.arrows.add(
      this.add.image(config.width / 2 + 154, config.height / 2 + 50, "arrowR")
    );

    this.rectanglesMus = this.add.group();
    this.renderMus();

    this.backBtn = this.add
      .bitmapText(
        config.width / 2 - 75,
        config.height / 2 + 125,
        "AGoblinAppears",
        "SALVAR E VOLTAR",
        20
      )
      .setOrigin(0.25);

    this.backBtn.setInteractive({ useHandCursor: true });
    this.backBtn.on(
      "pointerdown",
      () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("bootGame");
      },
      this
    );

    for (let i = 0; i < this.arrows.children.entries.length; i++) {
      this.arrows.children.entries[i].setInteractive({ useHandCursor: true });
    }
    this.input.on("pointerover", this.pointerOver, this);
    this.input.on("pointerout", this.pointerOut, this);
    this.arrows.children.entries[0].on("pointerdown", this.decreaseFx, this);
    this.arrows.children.entries[1].on("pointerdown", this.increaseFx, this);
    this.arrows.children.entries[2].on("pointerdown", this.decreaseMus, this);
    this.arrows.children.entries[3].on("pointerdown", this.increaseMus, this);
  }

  pointerOver(pointer, gameObject) {
    gameObject[0].setScale(1.1, 1.1);
  }

  pointerOut(pointer, gameObject) {
    gameObject[0].setScale(1, 1);
  }

  renderFx() {
    this.rectanglesFx.clear(true, true);
    for (
      let i = 0, j = -126;
      i < gameSettings.soundFx.volume * 10;
      i++, j += 28
    ) {
      this.rectanglesFx.add(
        this.add.image(
          config.width / 2 + j,
          config.height / 2 - 75,
          "rectangle"
        )
      );
    }
  }

  increaseFx() {
    if (gameSettings.soundFx.volume < 1) {
      gameSettings.soundFx.volume = (gameSettings.soundFx.volume * 10 + 1) / 10;
      this.renderFx();
    }
    this.buttonClick.play(gameSettings.soundFx);
  }

  decreaseFx() {
    if (gameSettings.soundFx.volume > 0) {
      gameSettings.soundFx.volume = (gameSettings.soundFx.volume * 10 - 1) / 10;
      this.renderFx();
    }
    this.buttonClick.play(gameSettings.soundFx);
  }

  renderMus() {
    this.rectanglesMus.clear(true, true);
    for (
      let i = 0, j = -126;
      i < gameSettings.music.volume * 10;
      i++, j += 28
    ) {
      this.rectanglesMus.add(
        this.add.image(
          config.width / 2 + j,
          config.height / 2 + 50,
          "rectangle"
        )
      );
    }
  }

  increaseMus() {
    if (gameSettings.music.volume < 1) {
      gameSettings.music.volume = (gameSettings.music.volume * 10 + 1) / 10;
      this.renderMus();
      music.setVolume(gameSettings.music.volume);
    }
    this.buttonClick.play(gameSettings.soundFx);
  }

  decreaseMus() {
    if (gameSettings.music.volume > 0) {
      gameSettings.music.volume = (gameSettings.music.volume * 10 - 1) / 10;
      this.renderMus();
      music.setVolume(gameSettings.music.volume);
    }
    this.buttonClick.play(gameSettings.soundFx);
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}
