import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  playerName = '';

  onKey(event: any) {
    // without type info
    this.playerName += event.target.value + ' | ';
  }

  constructor() {}

  ngOnInit(): void {}
}
