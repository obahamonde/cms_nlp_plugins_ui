export type UserState = {
  id: string;
  name: string;
  photoURL: string;
  email?: string | null;
};

export type Message = {
  id?: string;
  role: string;
  content: string;
  createdAt: Date;
  threadId: string;
};


export type DocumentRef<T> = {
  user: UserState;
} & T;