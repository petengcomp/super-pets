var vermelho = 0xff0000;
var semCor = 0xffffff;

class Fases extends Phaser.Scene {
  constructor() {
    super("fases");
  }

  //Funcao para puxar dados de outras cenas
  init(data) {
    //Puxando qual personagem é e qual fase estamos
    this.personagem = data.personagem;
    this.fase = data.fase;
  }

  create() {
    //this.time.remove()
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background-jogo")
      .setOrigin(0, 0);

    //Define as caracteristicas para qual fase esta sendo jogada
    this.IniciaFase();

    //Adiciona grupos para os tiros, naves e power ups
    this.shots = this.physics.add.group();
    this.navesFaceis = this.physics.add.group();
    this.navesDificeis = this.physics.add.group();
    this.powerups = this.physics.add.group();

    //Inicializa o personagem e o menu de pause
    this.setPersonagem();
    this.setMenu();

    //Define tamanho e fisica para o jogador
    this.player.setSize(50, 15);
    this.physics.world.enable(this.player);

    //Inicializa as teclas que serão utilizadas
    this.setTeclas();

    //Define as colisõs: tiro-naveFacil, jogador-naveFacil, tiro-naveDificil, jogador-naveDificil, jogador-powerup
    this.physics.add.overlap(
      this.shots,
      this.navesFaceis,
      this.damageNave,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.navesFaceis,
      this.damagePlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.shots,
      this.navesDificeis,
      this.damageNave,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.navesDificeis,
      this.damagePlayer,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.powerups,
      this.pickPowerup,
      null,
      this
    );

    //Define a aba de pontuação
    this.score = 0;
    this.scoreDisplay = this.add
      .bitmapText(20, 20, "AGoblinAppears", this.score, 10)
      .setDepth(1)
      .setTint(this.color);

    //Define o botão de pause
    this.pause = this.add
      .sprite(config.width - 50, 15, "pause")
      .setOrigin(0, 0)
      .setScale(0.07)
      .setDepth(1)
      .setTint(this.color);
    this.pause.setInteractive({ useHandCursor: true });
    this.pause.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.pausado();
    });

    //Define os sons que o jogo terá
    this.explosionSound = this.sound.add("explosion");
    this.shotSound = this.sound.add("shot");
    this.buttonClick = this.sound.add("buttonClick");
    this.powerUpSound = this.sound.add("powerUpSound");
    this.deathSound = this.sound.add("deathSound");

    //Chama a funcao de reiniciar as variaveis do jogo
    this.resetGame();
  }

  update() {
    //Verifica se o jogo nao esta pausado
    if (!this.jogoPausado) {
      //Movimenta o fundo
      this.background.tilePositionY -= this.velFundo;

      //Chama a funcao para movimentar o personagem e a mira
      this.handleMovement();

      //Cria filhos do grupo de tiros, e caso o tiro passe os limites da tela, ele se destruirá
      this.shots.getChildren().forEach((shot) => {
        if (
          shot.x > config.width ||
          shot.x < 0 ||
          shot.y > config.height ||
          shot.y < 0
        )
          shot.destroy();
      });

      //Cria filhos do grupo de naves faceis, e caso a nave passe os limites da tela, ela se destruirá
      this.navesFaceis.getChildren().forEach((naveFacil) => {
        //chegando em determinadas alturas, ele se deslocará para um outro lado em X
        if (naveFacil.y > 0) naveFacil.setVelocityX(40);
        if (naveFacil.y > config.height / 4 - 100) naveFacil.setVelocityX(40);
        if (naveFacil.y > config.height / 3) naveFacil.setVelocityX(-40);
        if (naveFacil.y > config.height / 2) naveFacil.setVelocityX(40);
        if (naveFacil.y > config.height + 50) naveFacil.destroy();
      });

      //Cria filhos do grupo de naves dificeis, e caso a nave passe os limites da tela, ela se destruirá
      this.navesDificeis.getChildren().forEach((naveDificil) => {
        //chegando em determinadas alturas, ele se deslocará para um outro lado em X
        if (naveDificil.y > 0 && naveDificil) naveDificil.setVelocityX(40);
        if (naveDificil.y > config.height / 4 - 100 && naveDificil)
          naveDificil.setVelocityX(40);
        if (naveDificil.y > config.height / 3 && naveDificil)
          naveDificil.setVelocityX(-40);
        if (naveDificil.y > config.height / 2 && naveDificil)
          naveDificil.setVelocityX(40);
        if (naveDificil.y > config.height + 50) naveDificil.destroy();
      });

      //Cria filhos do grupo de power-ups, e caso passe os limites da tela, ele se destruirá
      this.powerups.getChildren().forEach((powerup) => {
        powerup.rotation += 0.01;
        if (powerup.y > config.height + 50) powerup.destroy();
      });

      //Display de score onde é mostrado o quanto vc tem e o quanto é necessário
      this.scoreDisplay.setText(
        this.score.toString() + "/" + this.pontuacaoNecessaria
      );

      //Se atinge a pontuacao necessaria, troca de nivel
      if (this.score >= this.pontuacaoNecessaria) {
        this.TrocaNivel();
      }

      //Se o esc é apertado, pausa o jogo
      if (this.esc.isDown) {
        this.pausado();
      }
    }
  }

  //Funcao para iniciar as variaveis da fase
  IniciaFase() {
    this.jogoPausado = false;
    this.JaPegouPowerUp = false;

    //Vetor que controla as fases que foram liberadas
    this.niveisLiberados = new Array();

    this.multiplicadorPontos = 1;
    this.tempoRegressivo = 10;

    if (this.fase == "fase1") {
      this.velPadraoFundo = 1;

      //Define qual fase estamos
      this.niveisLiberados = [1, 0, 0, 0, 0, 0];

      //Pontuacao necessaria para passar de fase
      this.pontuacaoNecessaria = 1500;

      //Define a velocidade do fundo
      this.velFundo = this.velPadraoFundo;

      //Define tempo de surgimento inimigo facil
      this.tempoInimigosFaceis = 1500;

      //Define tempo de surgimento inimigo dificil
      this.tempoInimigosDificeis = 1900;

      //Define a cor de fundo do mapa
      this.background.setTint(0xffffff);

      //Define a cor das letras para nao ficar sumido dependendo da cor de fundo
      this.color = 0x000000;

      music.stop();
      music = this.sound.add("musicFase1");
      music.play(gameSettings.music);
    } else if (this.fase == "fase2") {
      this.velPadraoFundo = 1.1;
      this.niveisLiberados = [1, 1, 0, 0, 0, 0];
      this.pontuacaoNecessaria = 10;
      this.velFundo = this.velPadraoFundo;
      this.tempoInimigosFaceis = 2500;
      this.tempoInimigosDificeis = 1900;
      this.background.setTint(0xf5f5dc);
      this.color = 0x000000;

      music.stop();
      music = this.sound.add("musicFase2");
      music.play(gameSettings.music);
    } else if (this.fase == "fase3") {
      this.velPadraoFundo = 1.2;
      this.niveisLiberados = [1, 1, 1, 0, 0, 0];
      this.pontuacaoNecessaria = 10;
      this.velFundo = this.velPadraoFundo;
      this.tempoInimigosFaceis = 3500;
      this.tempoInimigosDificeis = 1900;
      this.background.setTint(0xbe935a);
      this.color = 0xffffff;

      music.stop();
      music = this.sound.add("musicFase3");
      music.play(gameSettings.music);
    } else if (this.fase == "fase4") {
      this.velPadraoFundo = 1.3;
      this.niveisLiberados = [1, 1, 1, 1, 0, 0];
      this.pontuacaoNecessaria = 10;
      this.velFundo = this.velPadraoFundo;
      this.tempoInimigosFaceis = 4500;
      this.tempoInimigosDificeis = 1900;
      this.background.setTint(0xfa5728);
      this.color = 0xffffff;

      music.stop();
      music = this.sound.add("musicFase4");
      music.play(gameSettings.music);
    } else if (this.fase == "fase5") {
      this.velPadraoFundo = 1.4;
      this.niveisLiberados = [1, 1, 1, 1, 1, 0];
      this.pontuacaoNecessaria = 10;
      this.velFundo = this.velPadraoFundo;
      this.tempoInimigosFaceis = 5500;
      this.tempoInimigosDificeis = 1900;
      this.background.setTint(0xd3d3d3);
      this.color = 0x000000;

      music.stop();
      music = this.sound.add("musicFase5");
      music.play(gameSettings.music);
    } else if (this.fase == "fase6") {
      this.velPadraoFundo = 1.5;
      this.niveisLiberados = [1, 1, 1, 1, 1, 1];
      this.pontuacaoNecessaria = 10;
      this.velFundo = this.velPadraoFundo;
      this.tempoInimigosFaceis = 6500;
      this.tempoInimigosDificeis = 1900;
      this.background.setTint(0x008000);

      music.stop();
      music = this.sound.add("musicFase6");
      music.play(gameSettings.music);
    }
  }

  //Funcao para inicializar o menu de pause
  setMenu() {
    //Container para obter todos os dados do menu de pause
    this.menu = this.add
      .container(0, 0, [
        (this.fundopause = this.add
          .sprite(0, 0, "fundoPause")
          .setOrigin(0, 0)
          .setAlpha(0.8)
          .setScale(3)),
        (this.TextopauseSombra = this.add
          .bitmapText(253, 53, "AGoblinAppears", "Pause", 40)
          .setOrigin(0.5)
          .setTint(0x000000)
          .setAlpha(0.3)),
        (this.Textopause = this.add
          .bitmapText(250, 50, "AGoblinAppears", "Pause", 40)
          .setOrigin(0.5)),
        (this.ResumeSombra = this.add
          .bitmapText(
            config.width / 2 - 47,
            config.height / 2 - 7,
            "AGoblinAppears",
            "Continuar",
            20
          )
          .setOrigin(0.25)
          .setTint(0x000000)
          .setAlpha(0.3)),
        (this.Resume = this.add
          .bitmapText(
            config.width / 2 - 50,
            config.height / 2 - 10,
            "AGoblinAppears",
            "Continuar",
            20
          )
          .setOrigin(0.25)
          .setInteractive({ useHandCursor: true })),
        (this.sairSombra = this.add
          .bitmapText(
            config.width / 2 - 17,
            config.height / 2 + 43,
            "AGoblinAppears",
            "Sair",
            20
          )
          .setOrigin(0.25)
          .setTint(0x000000)
          .setAlpha(0.3)),
        (this.sair = this.add
          .bitmapText(
            config.width / 2 - 20,
            config.height / 2 + 40,
            "AGoblinAppears",
            "Sair",
            20
          )
          .setOrigin(0.25)
          .setInteractive({ useHandCursor: true })),
      ])
      .setDepth(1);

    //Deixa o menu invisivel
    this.menu.visible = false;
  }

  //Funcao para inicializar o personagem
  setPersonagem() {
    if (this.personagem == "dog") {
      //Container para aplicar sombra no personagem tambem
      this.player = this.add
        .container(config.width / 2, config.height - 20, [
          (this.sombraPlayer = this.physics.add
            .sprite(5, 8, "naveCachorro")
            .play("cachorro-fly")
            .setTint(0x000000)
            .setAlpha(0.4)),
          (this.spaceship = this.physics.add
            .sprite(0, 0, "naveCachorro")
            .play("cachorro-fly")),
        ])
        .setDepth(1);
    } else {
      //Container para aplicar sombra no personagem tambem
      this.player = this.add
        .container(config.width / 2, config.height - 20, [
          (this.sombraPlayer = this.physics.add
            .sprite(5, 8, "naveGato")
            .play("gato-fly")
            .setTint(0x000000)
            .setAlpha(0.4)),
          (this.spaceship = this.physics.add
            .sprite(0, 0, "naveGato")
            .play("gato-fly")),
        ])
        .setDepth(1);
    }
  }

  //Funcao para inicializar as teclas
  setTeclas() {
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.pointer = this.input.activePointer;
  }

  //Funcao que reinicia o jogo
  resetGame() {
    this.tempoRegressivo = 10;
    this.score = 0;
    this.JaPegouPowerUp = false;
    this.canShoot = true;
    this.time.removeAllEvents();

    //Elimina tudo que esta na tela
    this.shots.clear(true, true);
    this.navesFaceis.clear(true, true);
    this.navesDificeis.clear(true, true);
    this.powerups.clear(true, true);

    //Evento de timer, a cada tempo descrito, ele ira adicionar uma nova nava Facil ao grupo de naves faceis
    this.time.addEvent({
      delay: this.tempoInimigosFaceis,
      callback: () => {
        //Se o jogo tiver pausado, nao fara isso
        if (!this.jogoPausado) {
          //Gera uma posição aleatória para a nave
          const x = Math.random() * config.width;
          const y = Math.random() * 50 - 100;
          const nave = this.physics.add
            .sprite(x, y, "naveFacil")
            .setData("life", 100.0);

          this.navesFaceis.add(nave);
          const vel = 100;
          nave.setVelocityY(vel).setSize(50, 60);
        }
      },
      callbackScope: this,
      repeat: -1,
    });

    //Evento de timer, a cada tempo descrito, ele ira adicionar uma nova nava Dificil ao grupo de naves dificil
    this.time.addEvent({
      delay: this.tempoInimigosDificeis,
      callback: () => {
        //Se o jogo tiver pausado, nao fara isso
        if (!this.jogoPausado) {
          //Gera uma posição aleatória para a nave
          const x = Math.random() * config.width;
          const y = Math.random() * 50 - 100;
          const nave = this.physics.add
            .sprite(x, y, "naveDificil")
            .setData("life", 150.0);

          this.navesDificeis.add(nave);
          const vel = 120;
          nave.setVelocityY(vel).setSize(50, 60);
        }
      },
      callbackScope: this,
      repeat: -1,
    });

    //Evento de timer, a cada tempo descrito, ele ira adicionar um novo power-up ao grupo de power-ups
    if (!this.jogoPausado && !this.JaPegouPowerUp) {
      this.time.addEvent({
        delay: 7000,
        callback: () => {
          if (!this.jogoPausado && !this.JaPegouPowerUp) {
            const a = Math.random() * config.width;
            const b = Math.random() * 50 - 100;
            const vel = Math.random() * 25 + 50;

            //Caso seja cachorro, irá usar um osso, se não, um peixe
            if (this.personagem == "dog") {
              var name = "osso";
            } else {
              var name = "peixe";
            }
            const powerup = this.physics.add.sprite(a, b, name);
            this.powerups.add(powerup);
            powerup.setVelocityY(vel).setSize(50, 60);
          }
        },
        callbackScope: this,
        repeat: -1,
      });
    }

    //Inicia a posicação do personagem principal
    this.player
      .setActive(true)
      .setPosition(config.width / 2, config.height - 20);
  }

  //Funcao para trocar de nível
  TrocaNivel() {
    this.velFundo = 0;
    this.jogoPausado = true;
    this.physics.pause();
    this.add
      .sprite(0, 0, "fundoPause")
      .setOrigin(0, 0)
      .setAlpha(0.8)
      .setDepth(1)
      .setScale(3);

    //Usa os graficos para definir a caixa de mensagem de proxima fase
    var boxe = this.add.graphics();
    boxe.fillStyle(0x463bf1, 1.0);
    boxe.fillRoundedRect(95, 80, 310, 240, 4);
    boxe.setDepth(1.1);

    //Usa os graficos para definir a caixa do botão para seguir para a proxima fase
    var botton = this.add.graphics();
    botton.fillStyle(0x211c73, 1.0);
    botton.fillRoundedRect(125, 245, 250, 40, 4);
    botton.setDepth(1.1);

    //Se for a ultima fase, ele avisará que o jogo chegou ao fim e voltará ao menu
    if (this.fase == "fase6") {
      this.add
        .bitmapText(245, 170, "AGoblinAppears", " FIM DE\n\n  JOGO", 24)
        .setOrigin(0.5)
        .setDepth(1.1);
      this.nextLevel = this.add
        .bitmapText(235, 260, "AGoblinAppears", "Sair", 18)
        .setOrigin(0.25)
        .setDepth(1.1);
    } else {
      this.add
        .bitmapText(250, 150, "AGoblinAppears", "  OBJETIVO\n\nCONCLUIDO!", 24)
        .setOrigin(0.5)
        .setDepth(1.1);
      this.nextLevel = this.add
        .bitmapText(195, 260, "AGoblinAppears", "Proxima fase", 18)
        .setOrigin(0.25)
        .setDepth(1.1);
    }

    //Gera interação com o botão para ir para o menu de escolhas de fases ou para o menu
    this.nextLevel.setInteractive({ useHandCursor: true });

    this.nextLevel.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.scene.start("playGame", {
        personagem: this.personagem,
        niveis: this.niveisLiberados,
      });
    });
    this.nextLevel.on("pointerover", () => {
      this.nextLevel.setScale(1.1);
    });
    this.nextLevel.on("pointerout", () => {
      this.nextLevel.setScale(1);
    });
  }

  //Funcao que trata o dano causado a nave
  damageNave(shot, nave) {
    //Destroi o tiro ao se chocar com a nave
    shot.destroy();
    //Tira 5 de vida da nave
    nave.data.values.life -= 5.0;
    //aumenta a pontuação por cada dano
    this.score += 1 * this.multiplicadorPontos;

    //Se a vida da nave for menor ou igual a 0, destroi a nave e aumenta a pontuacao
    if (nave.getData("life") <= 0) {
      this.score += 100 * this.multiplicadorPontos;
      nave.destroy();
      this.explosionSound.play(gameSettings.soundFx);
    }

    //Para cada nível de dano na nave, ele alterará a cor em cada parte da mesma
    //Sendo a ordem: Esquerda Cima, Direita Cima, Direita Baixo, Esquerda Baixo
    if (nave.getData("life") <= 80 && nave.getData("life") >= 61) {
      nave.setTint(vermelho, semCor, semCor, semCor);
    }
    if (nave.getData("life") <= 60 && nave.getData("life") >= 41) {
      nave.setTint(vermelho, vermelho, semCor, semCor);
    }
    if (nave.getData("life") <= 40 && nave.getData("life") >= 21) {
      nave.setTint(vermelho, vermelho, semCor, vermelho);
    }
    if (nave.getData("life") <= 20 && nave.getData("life") >= 1) {
      nave.setTint(vermelho, vermelho, vermelho, vermelho);
    }
  }

  //Funcao que trata o dano que a nave causa ao jogador
  damagePlayer() {
    //Toca o som do jogador morrendo
    this.deathSound.play(gameSettings.soundFx);

    //Container para controlar o menu de game over que aparecerá
    this.gameover = this.add
      .container(0, 0, [
        this.add
          .sprite(0, 0, "fundoPause")
          .setOrigin(0, 0)
          .setAlpha(0.8)
          .setDepth(1)
          .setScale(3),
        (this.boxe = this.add
          .graphics()
          .fillStyle(0xcc0000, 1.0)
          .fillRoundedRect(95, 80, 310, 240, 4)
          .setDepth(1.1)),
        (this.botton = this.add
          .graphics()
          .fillStyle(0x8c0000, 1.0)
          .fillRoundedRect(125, 245, 250, 40, 4)
          .setDepth(1.1)),
        this.add
          .bitmapText(240, 160, "AGoblinAppears", "  GAME\n\n  OVER", 26)
          .setOrigin(0.5)
          .setDepth(1.1),
        (this.nextLevel = this.add
          .bitmapText(215, 260, "AGoblinAppears", "Reiniciar", 18)
          .setOrigin(0.25)
          .setDepth(1.1)),
      ])
      .setDepth(1);

    this.velFundo = 0;
    this.jogoPausado = true;
    this.physics.pause();

    this.nextLevel.setInteractive({ useHandCursor: true });
    this.nextLevel.on("pointerdown", () => {
      //Caso esteja rolando um power-up, ele destroi os displays do mesmo
      if (this.JaPegouPowerUp) {
        this.buttonClick.play(gameSettings.soundFx);
        this.Contagem.destroy();
        this.powerupDisplay.destroy();
      }
      this.velFundo = this.velPadraoFundo;
      this.physics.resume();
      this.jogoPausado = false;
      this.resetGame();
      this.gameover.destroy();
    });
    this.nextLevel.on("pointerover", () => {
      this.nextLevel.setScale(1.1);
    });
    this.nextLevel.on("pointerout", () => {
      this.nextLevel.setScale(1);
    });
  }

  //Funcao que controla a movimentação e tiros do jogador
  handleMovement() {
    const vel = 2;

    //Controla a movimentacao do personagem
    if (this.up.isDown) this.player.y -= vel;
    if (this.down.isDown) this.player.y += vel;
    if (this.left.isDown) this.player.x -= vel;
    if (this.right.isDown) this.player.x += vel;

    //Controla a movimentação da mira
    let angle =
      Math.PI / 2 +
      Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.pointer.worldX,
        this.pointer.worldY
      );
    if (angle > Math.PI / 3) angle = Math.PI / 3;
    if (angle < -Math.PI / 3) angle = -Math.PI / 3;

    if (this.pointer.leftButtonDown() && this.canShoot) {
      //Manipulação matemática para definir o angulo que irá sair os tiros
      angle -= Math.PI / 2;
      const shotVel = 250;
      const spacing = 0.4;
      const x1 = this.player.x + Math.cos(angle + spacing) * 18;
      const x2 = this.player.x + Math.cos(angle - spacing) * 18;
      const y1 = this.player.y - 9 + Math.sin(angle + spacing) * 18;
      const y2 = this.player.y - 9 + Math.sin(angle - spacing) * 18;
      const shots = [
        this.physics.add.sprite(x1, y1, "shot"),
        this.physics.add.sprite(x2, y2, "shot"),
      ];
      this.shots.add(shots[0]);
      this.shots.add(shots[1]);
      this.shotSound.play(gameSettings.soundFx);
      shots[0].setVelocity(
        shotVel * Math.cos(angle),
        shotVel * Math.sin(angle)
      );
      shots[1].setVelocity(
        shotVel * Math.cos(angle),
        shotVel * Math.sin(angle)
      );
      this.canShoot = false;

      //Define o tempo de tiro do jogador
      this.time.addEvent({
        delay: 100,
        callback: () => {
          this.canShoot = true;
        },
        callbackScope: this,
      });
    }
  }

  EventoPowerUp() {
    this.Contagem = this.add
      .bitmapText(250, 50, "AGoblinAppears", this.tempoRegressivo, 10)
      .setDepth(0.9)
      .setTint(this.color);

    //Depois de 10 segundos, ele voltará todas as variaveis ao padrão, independente de qual power-up ele pegou
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.powerupDisplay.destroy();
        this.multiplicadorPontos = 1;
        this.physics.world.enable(this.player);
        this.Contagem.destroy();
        this.JaPegouPowerUp = false;
        this.tempoRegressivo = 10;
        this.spaceship.setTint(semCor);
      },
      callbackScope: this,
      repeat: 0,
    });

    //A cada um segundo ele reduzirá o tempo do cronômetro
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tempoRegressivo -= 1;
        this.Contagem.setText(this.tempoRegressivo);
      },
      callbackScope: this,
      repeat: 8,
    });
  }

  pickPowerup(player, powerup) {
    //Gera um numero aleatorio de 0 a 10
    this.poder = Math.floor(Math.random() * 10);

    //Toca o som do powerUp
    this.powerUpSound.play(gameSettings.soundFx);

    //Destroi o powerUp e limpa todos os outros que estiverem na tela
    powerup.destroy();
    this.powerups.clear(true, true);

    //Caso seja 0 ou 1, ele ira explodir todas as naves na tela usando a funcao clear
    if (this.poder < 2) {
      this.navesFaceis.clear(true, true);
      this.navesDificeis.clear(true, true);
      this.powerupDisplay = this.add
        .bitmapText(155, 20, "AGoblinAppears", "EXPLODE GERAL", 15)
        .setDepth(0.9)
        .setTint(this.color);

      //Toca o som de explosão dos inimigos
      this.explosionSound.play(gameSettings.soundFx);

      //Depois de dois segundos, sumirá a mensagem na tela
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.powerupDisplay.destroy();
        },
        callbackScope: this,
        repeat: 0,
      });
      return;
    }

    //Define a variavel que ja pegou um power-up para que outros não apareçam na tela
    this.JaPegouPowerUp = true;

    //Se o numero for de 2 a 5, ele irá dobrar o numero de pontos que vc adquirir, caso contrario irá adquirir a invencibilidade
    if (this.poder >= 2 && this.poder < 6) {
      this.multiplicadorPontos = 2;
      this.powerupDisplay = this.add
        .bitmapText(185, 20, "AGoblinAppears", "2X PONTOS", 15)
        .setDepth(0.9)
        .setTint(this.color);
    } else {
      //Desativa as colisões do player
      this.physics.world.disable(this.player);
      this.powerupDisplay = this.add
        .bitmapText(150, 20, "AGoblinAppears", "INVENCIBILIDADE", 15)
        .setDepth(0.9)
        .setTint(this.color);

      //Define a cor vermelha para o jogador
      this.spaceship.setTint(0xff6961);

      //Depois de 7 segundos ele irá ficar piscando vermelho a cada 0.3 segundos, para avisar que está chegando ao fim do poder
      this.time.addEvent({
        delay: 7000,
        callback: () => {
          //Define cor padrão
          this.spaceship.setTint(semCor);

          //Muda para vermelho em 0.3 segundos
          this.time.addEvent({
            delay: 300,
            callback: () => {
              this.spaceship.setTint(0xff6961);
            },
            callbackScope: this,
            repeat: 5,
          });
          //Volta a cor padrão em 0.6 segundos
          this.time.addEvent({
            delay: 600,
            callback: () => {
              this.spaceship.setTint(semCor);
            },
            callbackScope: this,
            repeat: 4,
          });
        },
        callbackScope: this,
        repeat: 0,
      });
    }
    //Chama função que controla o tempo do power-up
    this.EventoPowerUp();
  }

  //Funcao que define o menu de pause, parando as fisicas e animações
  pausado() {
    this.time.paused = true;
    this.velFundo = 0;
    this.jogoPausado = true;
    this.menu.visible = true;

    this.Resume.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.time.paused = false;
      this.velFundo = this.velPadraoFundo;
      this.physics.resume();
      this.menu.visible = false;
      this.jogoPausado = false;
    });
    this.Resume.on("pointerover", () => {
      this.Resume.setScale(1.1);
      this.ResumeSombra.setScale(1.1);
    });
    this.Resume.on("pointerout", () => {
      this.Resume.setScale(1);
      this.ResumeSombra.setScale(1);
    });

    this.sair.on("pointerdown", () => {
      this.buttonClick.play(gameSettings.soundFx);
      this.time.paused = false;
      this.velFundo = this.velPadraoFundo;
      this.jogoPausado = false;
      this.menu.visible = false;
      this.scene.start("Load");
    });
    this.sair.on("pointerover", () => {
      this.sair.setScale(1.1);
      this.sairSombra.setScale(1.1);
    });
    this.sair.on("pointerout", () => {
      this.sair.setScale(1);
      this.sairSombra.setScale(1);
    });

    this.physics.pause();
  }
}
