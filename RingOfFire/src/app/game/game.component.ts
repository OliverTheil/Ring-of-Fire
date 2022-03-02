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
  currentCard: string = '';

  constructor() {}

  ngOnInit(): void {
    this.newGame();
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

  addUser() {
    let showUserName = document.getElementById('userName').innerHTML;
    showUserName = this.playerName;
    if (this.game.players.length > 4) {
      alert('The limit are 5 Players. Please delete one');
    } else if (this.game.players.includes(showUserName)) {
      alert(
        'An user with this name already exists. Please enter another name.'
      );
    } else if (showUserName.length < 4) {
      alert('At least 4 letters.');
    } else {
      this.game.players.push(showUserName);
    }
  }

  newGame() {
    this.game = new Game();
  }
}
