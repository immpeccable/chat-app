export interface I_USER {
  _id: string;
  username: string;
  password: string;
  email: string;
  profileImage?: any;
  profileImageUrl?: string;
}

export interface I_ACTION {
  type: ACTION_TYPES;
  value: any;
}

export enum ACTION_TYPES {
  changeUsername,
  changePassword,
  changeEmail,
  changeProfileImage,
}

export interface I_FRIEND_REQUEST {
  from: string;
  to: string;
}

export interface I_MESSAGE {
  from: string;
  content: string;
  createdAt?: string;
}

export interface I_CHATROOM {
  _id: string;
  owner: string;
  participants: (string | I_USER)[];
  authorized_participants: (string | I_USER)[];
  name: string;
  messages: I_MESSAGE[];
}
