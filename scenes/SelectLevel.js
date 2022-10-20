class SelectLevel extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  init(data) {
    this.personagem = data.personagem;
    this.niveisLiberados = data.niveis;
  }

  create() {
    if (music.key != "musicMenu") {
      music.stop();
      music = this.sound.add("musicMenu");
      music.play(gameSettings.music);
    }

    this.buttonClick = this.sound.add("buttonClick");

    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-menu")
      .setOrigin(0, 0);
    this.frase = this.add
      .bitmapText(90, 15, "AGoblinAppears", "ESCOLHA UMA FASE", 20)
      .setOrigin(0, 0);

    this.sol = this.physics.add
      .sprite(250, 200, "sol-animado")
      .setScale(1.7)
      .play("sun");
    this.level1 = this.add
      .image(175, 100, "level1")
      .setScale(1.7)
      .setInteractive({ useHandCursor: true });
    this.level2 = this.add
      .image(325, 100, "level2")
      .setScale(1.7)
      .setAlpha(0.2);
    this.level3 = this.add
      .image(400, 200, "level3")
      .setScale(1.7)
      .setAlpha(0.2);
    this.level4 = this.add
      .image(325, 300, "level4")
      .setScale(1.7)
      .setAlpha(0.2);
    this.level5 = this.add
      .image(175, 300, "level5")
      .setScale(1.7)
      .setAlpha(0.2);
    this.level6 = this.add
      .image(100, 200, "level6")
      .setScale(1.7)
      .setAlpha(0.2);

    this.buttonClick = this.sound.add("buttonClick");

    this.level1.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("fases", { personagem: this.personagem, fase: "fase1" });
    });
    this.level1.on("pointerover", () => {
      this.level1.setScale(2);
    });
    this.level1.on("pointerout", () => {
      this.level1.setScale(1.7);
    });

    if (this.niveisLiberados[0] == 1) {
      this.level2.alpha = 1;
      this.level2.setInteractive({ useHandCursor: true });
      this.level2.on("pointerdown", () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("fases", {
          personagem: this.personagem,
          fase: "fase2",
        });
      });
      this.level2.on("pointerover", () => {
        this.level2.setScale(2);
      });
      this.level2.on("pointerout", () => {
        this.level2.setScale(1.7);
      });
    }

    if (this.niveisLiberados[1] == 1) {
      this.level3.alpha = 1;
      this.level3.setInteractive({ useHandCursor: true });
      this.level3.on("pointerdown", () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("fases", {
          personagem: this.personagem,
          fase: "fase3",
        });
      });
      this.level3.on("pointerover", () => {
        this.level3.setScale(2);
      });
      this.level3.on("pointerout", () => {
        this.level3.setScale(1.7);
      });
    }

    if (this.niveisLiberados[2] == 1) {
      this.level4.alpha = 1;
      this.level4.setInteractive({ useHandCursor: true });
      this.level4.on("pointerdown", () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("fases", {
          personagem: this.personagem,
          fase: "fase4",
        });
      });
      this.level4.on("pointerover", () => {
        this.level4.setScale(2);
      });
      this.level4.on("pointerout", () => {
        this.level4.setScale(1.7);
      });
    }

    if (this.niveisLiberados[3] == 1) {
      this.level5.alpha = 1;
      this.level5.setInteractive({ useHandCursor: true });
      this.level5.on("pointerdown", () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("fases", {
          personagem: this.personagem,
          fase: "fase5",
        });
      });
      this.level5.on("pointerover", () => {
        this.level5.setScale(2);
      });
      this.level5.on("pointerout", () => {
        this.level5.setScale(1.7);
      });
    }

    if (this.niveisLiberados[4] == 1) {
      this.level6.alpha = 1;
      this.level6.setInteractive({ useHandCursor: true });
      this.level6.on("pointerdown", () => {
        this.buttonClick.play(gameSettings.soundFx);
        this.scene.start("fases", {
          personagem: this.personagem,
          fase: "fase6",
        });
      });
      this.level6.on("pointerover", () => {
        this.level6.setScale(2);
      });
      this.level6.on("pointerout", () => {
        this.level6.setScale(1.7);
      });
    }

    if (this.niveisLiberados[5] == 1) {
      this.scene.start("Load");
    }

    this.botaoBack = this.add
      .bitmapText(
        config.width / 2 - 25,
        config.height / 2 + 150,
        "AGoblinAppears",
        "VOLTAR",
        20
      )
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.25);

    this.botaoBack.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("EscolhaPersonagem");
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
