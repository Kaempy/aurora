import { ImagePickerAsset } from 'expo-image-picker';

type Base = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $tenant: string;
  $updatedAt: string;
};
type AuthorId = Base & {
  accountId: string;
  avatar: string;
  email: string;
  username: string;
};
type Video = Base & {
  authorId: AuthorId;
  prompt: string;
  thumbnail: string;
  title: string;
  video: string;
};
type UploadFile = {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
};
type Form = {
  title: string;
  video: ImagePickerAsset | null;
  thumbnail: ImagePickerAsset | null;
  prompt: string;
};

type CurrentUser = AuthorId & {
  videos: Video[] | [];
};
type Post = Form & { authorId?: string };
export type { CurrentUser, Form, Post, UploadFile, Video };
