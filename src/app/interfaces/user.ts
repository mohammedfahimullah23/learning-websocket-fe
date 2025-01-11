import { Session } from './session';

export interface User {
  id?: string;
  session: Session;
  name: string;
  vote?: number;
  hasVoted?: boolean;
  isActive?:boolean;
}

export type PutUser = Pick<User, 'isActive'>;
