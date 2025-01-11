import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class ModalComponent {
  isVisible: boolean = false;
  name: string = '';

  @Output() nameSubmitted = new EventEmitter<string>();

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.name = ''; 
  }

  submitName(): void {
    if (this.name) {
      this.nameSubmitted.emit(this.name);
      this.closeModal();
    }
  }
}
