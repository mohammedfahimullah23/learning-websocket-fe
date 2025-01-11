import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PokerSessionService } from '../../services/poker-session.service';
import { Session } from '../../interfaces/session';
import { catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [],
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
})
export class SessionComponent {
  private router = inject(Router);
  private pokerSessionService = inject(PokerSessionService);

  public createSession(): void {
    const session: Session = {
      name: `Session Name - ${Date.now()}`,
    };
    // check if the user is present or not. if not hide the
    this.pokerSessionService
      .createPokerSession(session)
      .pipe(
        tap((response) => {
          this.router.navigate([`main-page/${response.id}`]);
        }),
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(
            () => new Error('An error occurred while creating the session.')
          );
        })
      )
      .subscribe();
  }
}
