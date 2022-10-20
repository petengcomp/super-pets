var niveisLiberados = new Array(5);

class SelectCharacter extends Phaser.Scene {
  constructor() {
    super("EscolhaPersonagem");
  }

  create() {
    if (music.key != "musicMenu") {
      music.stop();
      music = this.sound.add("musicMenu");
      music.play(gameSettings.music);
    }

    niveisLiberados = [0, 0, 0, 0, 0];
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-menu")
      .setOrigin(0, 0);

    this.cat = this.sound.add("cat");
    this.dog = this.sound.add("dog");
    this.buttonClick = this.sound.add("buttonClick");

    this.add
      .bitmapText(30, 23, "AGoblinAppears", "ESCOLHA UM PERSONAGEM", 20)
      .setOrigin(0, 0)
      .setTint(0x000000)
      .setAlpha(0.5);
    this.add
      .bitmapText(27, 20, "AGoblinAppears", "ESCOLHA UM PERSONAGEM", 20)
      .setOrigin(0, 0);

    this.cachorroSombra = this.physics.add
      .sprite(config.width / 3 - 37, config.height / 2 + 3, "cachorro_parado")
      .setScale(1.5)
      .play("cachorro_idle")
      .setTint(0x000000)
      .setAlpha(0.5);
    this.cachorro = this.physics.add
      .sprite(config.width / 3 - 40, config.height / 2, "cachorro_parado")
      .setScale(1.5)
      .play("cachorro_idle");

    this.cachorro.setInteractive({ useHandCursor: true });

    this.cachorro.on("pointerdown", () => {
      this.personagem = "dog";
      this.dog.play(gameSettings.soundFx);
      this.scene.start("playGame", {
        personagem: this.personagem,
        niveis: niveisLiberados,
      });
    });
    this.cachorro.on("pointerover", () => {
      this.cachorro.setScale(1.8);
    });
    this.cachorro.on("pointerout", () => {
      this.cachorro.setScale(1.5);
    });

    this.gatoSombra = this.physics.add
      .sprite((2 * config.width) / 3 + 43, config.height / 2 + 3, "gato_parado")
      .setScale(1.5)
      .play("gato_idle")
      .setTint(0x000000)
      .setAlpha(0.5);
    this.gato = this.physics.add
      .sprite((2 * config.width) / 3 + 40, config.height / 2, "gato_parado")
      .setScale(1.5)
      .play("gato_idle");

    this.gato.setInteractive({ useHandCursor: true });

    this.gato.on("pointerdown", () => {
      this.personagem = "cat";
      this.cat.play(gameSettings.soundFx);
      this.scene.start("playGame", {
        personagem: this.personagem,
        niveis: niveisLiberados,
      });
    });
    this.gato.on("pointerover", () => {
      this.gato.setScale(1.8);
    });
    this.gato.on("pointerout", () => {
      this.gato.setScale(1.5);
    });

    this.botaoBack = this.add
      .bitmapText(
        config.width / 2 - 25,
        config.height / 2 + 125,
        "AGoblinAppears",
        "VOLTAR",
        20
      )
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.25);

    this.botaoBack.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("bootGame");
    });
    this.botaoBack.on("pointerover", () => {
      this.botaoBack.setScale(1.3);
    });
    this.botaoBack.on("pointerout", () => {
      this.botaoBack.setScale(1);
    });
  }

  update() {
    this.background.tilePositionY -= 0.5;
  }
}
