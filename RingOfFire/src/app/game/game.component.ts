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
  pickCardAnimation = false;
  addPlayerDialog = false;
  addMode = false;
  removeButtonEnabled = true;
  removeMode = false;

  currentCard: string = '';
  playerName: string = '';
  playerBg: string = '';

  constructor(
    private route: ActivatedRoute,
    public firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params.id);

      this.firestore
        .collection('games')
        .doc(params.id)
        .valueChanges()
        .subscribe((game) => {
          console.log('Game update', game);
        });
    });

    this.checkPlayers();
  }

  newGame() {
    this.game = new Game();
    // this.firestore.collection('games').add(this.game.toJson());
  }

  takeCard() {
    let gameArea = document.getElementById('gameArea');
    if (!this.pickCardAnimation && this.game.players.length != 0) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      if (this.game.players.length == this.game.currentPlayer) {
        this.game.currentPlayer = 0;
      }

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
        console.table(this.game);
      }, 2000);
    } else {
      this.noPlayer(gameArea);
      this.deleteAlertWindow();
    }
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
