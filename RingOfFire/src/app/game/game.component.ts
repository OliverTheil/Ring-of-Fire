import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game;
  addPlayerDialog = false;
  addMode = false;
  removeButtonEnabled = true;
  removeMode = false;
  playerName: string = '';
  playerBg: string = '';
  gameId: string;

  constructor(
    private route: ActivatedRoute,
    public firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Game update', game);
          this.game.currentPlayer = game.currentPlayer;
          this.game.playerBg = game.playerBg;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.currentCard = game.currentCard;
          this.game.pickCardAnimation = game.pickCardAnimation;
        });
    });

    this.checkPlayers();
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    let gameArea = document.getElementById('gameArea');
    if (!this.game.pickCardAnimation && this.game.players.length != 0) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.saveSession();
      if (this.game.players.length == this.game.currentPlayer) {
        this.game.currentPlayer = 0;
      }
      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        console.table(this.game);
        this.saveSession();
      }, 800);
    } else if (this.game.players.length == 0) {
      this.noPlayer(gameArea);
      this.deleteAlertWindow();
    }
    this.saveSession();
  }

  onKey(event: any) {
    this.playerName = event.target.value;
  }

  close() {
    if (!this.addPlayerDialog) {
      this.addPlayerDialog = true;
    } else {
      this.addPlayerDialog = false;
    }
    this.checkPlayers();
  }

  enableRemove() {
    if (!this.removeMode) {
      this.removeMode = true;
    } else {
      this.removeMode = false;
    }
  }

  removePlayer(i) {
    if (this.removeMode) {
      this.game.players.splice(i, 1);
      this.game.playerBg.splice(i, 1);
      this.game.stack.splice(i, 1);
      this.game.playedCards.splice(i, 1);
      this.removeMode = false;
      this.game.currentPlayer = 0;
      if (this.game.players.length == 0) {
        this.removeButtonEnabled = false;
      }
    }
    this.saveSession();
  }

  checkPlayers() {
    if (this.game.players.length < 5 && this.addPlayerDialog == true) {
      this.addMode = true;
    } else {
      this.addMode = false;
    }

    if (this.game.players.length == 0) {
      this.removeButtonEnabled = false;
    } else {
      this.removeButtonEnabled = true;
    }
  }

  openAddPlayerDialog() {
    if (this.addPlayerDialog) {
      this.addMode = false;
      this.addPlayerDialog = false;
    }
  }

  addPlayer() {
    let showPlayerName = document.getElementById('playerName').innerHTML;
    let gameArea = document.getElementById('gameArea');
    showPlayerName = this.playerName;

    if (this.game.players.length > 4) {
      this.tooMuchPlayer(gameArea);
      this.deleteAlertWindow();
    } else if (this.game.players.includes(showPlayerName)) {
      this.playerExists(gameArea);
      this.deleteAlertWindow();
    } else if (showPlayerName.length < 4) {
      this.letters(gameArea);
      this.deleteAlertWindow();
    } else {
      this.finishAddPlayer(showPlayerName);
      console.log(this.game);
    }
    this.saveSession();
  }

  saveSession() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }

  finishAddPlayer(showPlayerName) {
    this.game.players.push(showPlayerName);
    this.enableBackgroundColor();
    this.checkPlayers();
    if (this.game.players.length < 5) {
      this.addMode = true;
    }
    this.close();
  }

  enableBackgroundColor() {
    if (this.playerBg == '') {
      this.game.playerBg.push('bg--transparent');
    } else {
      this.game.playerBg.push(this.playerBg);
    }
    this.saveSession();
  }

  tooMuchPlayer(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          Please delete one player. 
        </div>
      </div>
      `;
  }

  noPlayer(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          At least one player. 
        </div>
      </div>
      `;
  }

  playerExists(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          An player with this name already exists. Please enter another name.
        </div>
      </div>
      `;
  }

  letters(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          At least 4 letters.
        </div>
      </div>
      `;
  }

  deleteAlertWindow() {
    setTimeout(() => {
      document.getElementById('gameArea').innerHTML = '';
    }, 2500);
  }

  changeBgBlue() {
    this.playerBg = 'bg--blue';
  }

  changeBgRed() {
    this.playerBg = 'bg--red';
  }

  changeBgGreen() {
    this.playerBg = 'bg--green';
  }

  changeBgPurple() {
    this.playerBg = 'bg--purple';
  }

  changeBgOrange() {
    this.playerBg = 'bg--orange';
  }

  changeBgLimette() {
    this.playerBg = 'bg--limette';
  }

  changeBgBlack() {
    this.playerBg = 'bg--black';
  }

  changeBgTransparent() {
    this.playerBg = 'bg--transparent';
  }
}
