export interface I_USER {
  username: string;
  password: string;
  email: string;
}

export interface I_ACTION {
  type: ACTION_TYPES;
  value: string;
}

export enum ACTION_TYPES {
  changeUsername,
  changePassword,
  changeEmail,
}

export interface I_FRIEND_REQUEST {
  from: string;
  to: string;
}
