class HowToPlay extends Phaser.Scene {
  constructor() {
    super("HowToPlay");
  }

  create() {
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-menu")
      .setOrigin(0, 0);

    this.buttonClick = this.sound.add("buttonClick");

    this.keys = this.add
      .image(config.width / 2 - 125, config.height / 2 - 50, "keys")
      .setScale(0.5);
    this.move = this.add
      .bitmapText(
        config.width / 2 - 125,
        config.height / 2 + 50,
        "AGoblinAppears",
        "MOVER",
        16
      )
      .setOrigin(0.5);

    this.mouse = this.add
      .image(config.width / 2 + 125, config.height / 2 - 50, "mouse")
      .setScale(0.5);
    this.shoot = this.add
      .bitmapText(
        config.width / 2 + 125,
        config.height / 2 + 50,
        "AGoblinAppears",
        "ATIRAR",
        16
      )
      .setOrigin(0.5);

    this.backBtn = this.add
      .bitmapText(
        config.width / 2 - 25,
        config.height / 2 + 125,
        "AGoblinAppears",
        "VOLTAR",
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

    this.input.on("pointerover", this.pointerOver, this);
    this.input.on("pointerout", this.pointerOut, this);
  }

  pointerOver(pointer, gameObject) {
    gameObject[0].setScale(1.1, 1.1);
  }

  pointerOut(pointer, gameObject) {
    gameObject[0].setScale(1, 1);
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}
