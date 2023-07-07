export interface I_USER {
  _id: string;
  username: string;
  password: string;
  email: string;
  profileImage?: any;
  profileImageUrl?: string;
  chatrooms: I_CHATROOM_STATE[];
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
  from_username: string;
  content: string;
  createdAt?: string;
  from_profile_image_url: string;
}

export interface I_CHATROOM {
  _id: string;
  owner: string;
  participants: (string | I_USER)[];
  authorized_participants: (string | I_USER)[];
  name: string;
  messages: I_MESSAGE[];
}

export interface I_CHATROOM_STATE {
  id: string;
  last_message_count: number;
  last_message_content: string;
  last_message_from: string;
}
