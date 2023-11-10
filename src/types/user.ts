export type Notification = {
  message: string;
  status: "success" | "error" | "warning" | "info";
};

export type UserState = {
  id?: string;
  name: string;
  photoURL: string;
  email?: string;
};

export type Message = {
  id?: string;
  role: string;
  content: string;
  createdAt: Date;
};

export type DocumentRef<T> = {
  user: UserState;
} & T;

export type Thread = {
  id?: string;
  created_at: string;
  metadata: Record<string, any>;
  object: string;
  oid: string;
};

export type FileData = {
  id?: string;
  bytes: number;
  created_at: number;
  filename: string;
  object: string;
  purpose: string;
  status: "processed";
};
