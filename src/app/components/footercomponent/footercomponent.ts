import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footercomponent',
  standalone: false,
  styleUrl: './footercomponent.css',
  templateUrl: './footercomponent.html',
})
export class Footercomponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {}
}
