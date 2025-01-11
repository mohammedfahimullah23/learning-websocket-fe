import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LocalStorageSessionService } from '../../services/session.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { UserService } from '../../services/user.service';
import { PokerSessionService } from '../../services/poker-session.service';
import { Session } from '../../interfaces/session';
import { PutUser, User } from '../../interfaces/user';
import { catchError, map, tap, throwError } from 'rxjs';
import { LocaStorageUser } from '../../interfaces/local-storage-user';
import { environment } from '../../../enviroments/environtment';
import { Transform } from '../../interfaces/transform';
import { WebSocketService } from '../../services/websocket.service';
import { WebSocketInterface } from '../../interfaces/web-socket';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  // @HostListener('window:beforeunload', ['$event'])
  // public beforeUnloadHandler(event: BeforeUnloadEvent): void {
  //   this.ngZone.runOutsideAngular(() => {
  //     const userId = this.userDetails.id;
  //     const sessionId = this.sessionDetails.id;
  //     if (userId && sessionId) {
  //       this.updateUserStatusSync(userId, sessionId, false);
  //     }

  //     event.preventDefault();
  //     event.returnValue = ''; // Required for some browsers
  //   });
  // }
  @Input()
  sessionId!: string;

  @ViewChild(ModalComponent, { static: true }) modal!: ModalComponent;

  public users: User[] = [];
  public userDetails!: User;

  private sessionDetails!: Session;
  private localStorageService = inject(LocalStorageSessionService);
  private pokerSessionService = inject(PokerSessionService);
  private userService = inject(UserService);
  // private ngZone = inject(NgZone);
  private webSocketService = inject(WebSocketService);

  public ngOnInit(): void {
    this.getSessionDetails();

    this.webSocketService.subscribeToTopic('/topic/useradd', (message) => {
      const msgBody = JSON.parse(message.body) as WebSocketInterface;
      console.log('mesg', msgBody);
      if (msgBody.type === 'entry') {
        console.log('entry', msgBody);
        const user: User = {
          session: this.sessionDetails,
          name: msgBody.userName,
          id: msgBody.id,
        };
        this.addUser(user);
      } else if (msgBody.type === 'leave') {
        console.log('leave', msgBody);
        this.users = this.users.filter((user) => user.id !== msgBody.id);
        const sessionId = this.sessionDetails?.id || '';
        this.updateUserStatusSync(msgBody.id, sessionId, false);
      }
    });
  }

  public getUserPosition(index: number): Transform {
    const totalUsers = this.users.length;
    const angle = (index / totalUsers) * 360;
    const radius = 120;

    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  }

  public handleSubmission(name: string): void {
    const userData: User = {
      session: this.sessionDetails,
      name: name,
    };
    this.userService.createUser(userData).subscribe({
      next: (user) => {
        this.userDetails = user;
        // this.addUser(this.userDetails);
        const localStorageUser: LocaStorageUser = {
          id: user.id ?? '',
          name: user.name,
        };
        this.localStorageService.storeUserDetails(localStorageUser);
        this.getAllActiveUsers();
      },
      error: (error) => {
        console.error('Error occurred:', error);
        return throwError(
          () => new Error('An error occurred while creating the user.')
        );
      },
    });
  }

  updateUserStatus(sessionId: string, userId: string, isActive: boolean): void {
    if (sessionId && userId) {
      this.userService
        .updatedUserActiveStatus(sessionId, userId, isActive)
        .pipe(
          tap((userDetails) => {
            this.userDetails = userDetails;
            // this.addUser(this.userDetails);
          }),
          catchError((error) => {
            console.error('Error occurred:', error);
            return throwError(
              () => new Error('An error occurred while creating the session.')
            );
          })
        );
    }
  }

  addUser(user: User) {
    this.users = [...this.users, user];
  }

  displayCreateNamePopup(): void {
    const userDetails = this.getUserDataFromLocalStorage();

    if (!userDetails) {
      this.modal.openModal();
      return;
    }

    const sessionId = this.sessionDetails?.id ?? '';
    const userId = userDetails?.id ?? '';

    if (sessionId && userId) {
      this.updateUserStatusSync(userId, sessionId, true); // We should not call this here but some reason loaduserdetails is not working
      // this.loadUserDetails(sessionId, userId);
      this.getAllActiveUsers();
    }
  }

  private getUserDataFromLocalStorage(): LocaStorageUser | null {
    const userDetails = this.localStorageService.getUserDetails();
    return userDetails ? (JSON.parse(userDetails) as LocaStorageUser) : null;
  }

  private loadUserDetails(sessionId: string, userId: string): void {
    this.userService.getUserDetailsBySessionId(sessionId, userId).subscribe(
      (response) => {
        this.userDetails = response;
        // this.addUser(this.userDetails);
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }

  private getSessionDetails(): void {
    this.pokerSessionService
      .getPokerSession(this.sessionId)
      .pipe(
        tap((sessionDetails) => {
          this.sessionDetails = sessionDetails;
          this.displayCreateNamePopup();
        })
      )
      .subscribe();
  }

  // This is defintely a bad practice. How to handle it in a different way
  private updateUserStatusSync(
    userId: string,
    sessionId: string,
    isActive: boolean
  ): void {
    const url = `${environment.apiUrl}/users/user/${userId}/session/${sessionId}/status`;
    const data = JSON.stringify({ isActive });
    const blob = new Blob([data], { type: 'application/json' });
    const success = navigator.sendBeacon(url, blob);
    if (!success) {
      console.error('Failed to send user status update using sendBeacon');
    }
  }

  private getAllActiveUsers(): void {
    const sessionId = this.sessionDetails?.id || '';
    this.userService.getAllActiveUsers(sessionId).subscribe((activeUsers) => {
      this.users = activeUsers;
    });
  }
}
