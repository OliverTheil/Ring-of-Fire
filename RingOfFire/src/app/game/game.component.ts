import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  playerName = '';
  game: Game;
  playerBg = '';
  addPlayerDialog = false;
  addUserPossible = false;
  removeUserButtonEnabled = true;
  removingUserMode = false;
  currentCard: string = '';

  constructor() {}

  ngOnInit(): void {
    this.newGame();
    this.checkUsers();
    console.log(this.addUserPossible);
  }

  newGame() {
    this.game = new Game();
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
      this.noUser(gameArea);
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
    this.checkUsers();
  }

  enableRemoveUserMode() {
    if (!this.removingUserMode) {
      this.removingUserMode = true;
    } else {
      this.removingUserMode = false;
    }
  }

  removeUser(i) {
    if (this.removingUserMode) {
      this.game.players.splice(i, 1);
      this.game.playerBg.splice(i, 1);
      this.game.stack.splice(i, 1);
      this.game.playedCards.splice(i, 1);
      this.removingUserMode = false;
      this.game.currentPlayer = 0;
      if (this.game.players.length == 0) {
        this.removeUserButtonEnabled = false;
      }
    }
  }

  checkUsers() {
    if (this.game.players.length < 5 && this.addPlayerDialog == true) {
      this.addUserPossible = true;
    } else {
      this.addUserPossible = false;
    }

    if (this.game.players.length == 0) {
      this.removeUserButtonEnabled = false;
    } else {
      this.removeUserButtonEnabled = true;
    }
  }

  openAddPlayerDialog() {
    if (this.addPlayerDialog) {
      this.addUserPossible = false;
      this.addPlayerDialog = false;
    }
  }

  addUser() {
    let showUserName = document.getElementById('userName').innerHTML;
    let gameArea = document.getElementById('gameArea');
    showUserName = this.playerName;

    if (this.game.players.length > 4) {
      this.tooMuchPlayer(gameArea);
      this.deleteAlertWindow();
    } else if (this.game.players.includes(showUserName)) {
      this.userExists(gameArea);
      this.deleteAlertWindow();
    } else if (showUserName.length < 4) {
      this.letters(gameArea);
      this.deleteAlertWindow();
    } else {
      this.finishAddUser(showUserName);
      console.log(this.game);
    }
  }

  finishAddUser(showUserName) {
    this.game.players.push(showUserName);
    this.enableBackgroundColor();
    this.checkUsers();
    if (this.game.players.length < 5) {
      this.addUserPossible = true;
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

  noUser(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          At least one user. 
        </div>
      </div>
      `;
  }

  userExists(gameArea) {
    gameArea.innerHTML += `
      <div>
        <div class="alertWindow z--5">
          An user with this name already exists. Please enter another name.
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
