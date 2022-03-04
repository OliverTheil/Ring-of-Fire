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
  addedPlayerBackground = '';
  addPlayerDialog = false;

  currentCard: string = '';

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
        console.table(this.game);
      }, 2000);
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
  }

  openAddPlayerDialog() {
    if (this.addPlayerDialog) {
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
      this.game.players.push(showUserName);
      this.addedPlayerBackground = this.playerBg;
      if (this.addedPlayerBackground == '') {
        this.game.playerBg.push('bg--transparent');
      } else {
        this.game.playerBg.push(this.addedPlayerBackground);
      }
      console.table(this.game);
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
    }, 2000);
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
