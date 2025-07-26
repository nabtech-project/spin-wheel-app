import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, CommonModule, FormsModule, InputTextModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('spin-wheel-app');

  constructor(private cdr: ChangeDetectorRef) { }

  nameFields: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
  rotation = 0;
  showDialog = false;
  winnerName: string | null = null;

  get itemCount() {
    return this.nameFields.length;
  }

  trackByIndex(index: number): number {
    return index;
  }

  launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  getHSL(index: number): string {
    const hue = (360 / this.nameFields.length) * index;
    return `hsl(${hue}, 100%, 75%)`;
  }

  spinWheel() {
    const wheel = document.querySelector('.ui-wheel-of-fortune ul') as HTMLElement;
    const randomTurns = Math.floor(Math.random() * 360) + 1800;
    const newRotation = this.rotation + randomTurns;

    const animation = wheel.animate([
      { transform: `rotate(${this.rotation}deg)` },
      { transform: `rotate(${newRotation}deg)` }
    ], {
      duration: 4000,
      easing: 'ease-out',
      fill: 'forwards'
    });

    this.rotation = newRotation;
    this.winnerName = null;

    animation.finished.then(() => {
      wheel.style.transform = `rotate(${this.rotation}deg)`;

      const angle = this.rotation % 360;
      const slice = 360 / this.itemCount;
      const pointerOffset = 90;
      const adjustedAngle = (360 - angle + pointerOffset + slice / 2) % 360;
      const index = Math.floor(adjustedAngle / slice);
      const winner = this.nameFields[index];

      this.winnerName = winner;
      this.launchConfetti();
      this.cdr.detectChanges();

      console.log({ rawAngle: angle, adjustedAngle, slice, index, winner });
    });
  }

  addNameField() {
    this.nameFields.push('');
  }

}