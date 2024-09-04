import { CurrentUser, Post, Video } from '@src/types/base';
import { ImagePickerAsset } from 'expo-image-picker';
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from 'react-native-appwrite';
export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.kaempy.aurora',
  projectId: '66c1cf93001871156e02',
  databaseId: '66c1d1dd000c30a7dee3',
  usersCollectionId: '66c1d236001ad9119597',
  videosCollectionId: '66c1d2a9000c7c9ad996',
  storageId: '66c1d5cf0020c9da5736',
};
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  videosCollectionId,
  storageId,
} = config;
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

type User = { email: string; password: string; username?: string };

// Create a new user
const createUser = async (body: User) => {
  const { email, password, username } = body;
  try {
    // Register User
    const newAcct = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log(newAcct, 'newAcct');
    if (!newAcct) throw Error;
    const avatarUrl = avatar.getInitials(username);
    await signin({ email, password });
    const newUser = await databases.createDocument<CurrentUser>(
      databaseId,
      usersCollectionId,
      ID.unique(),
      { accountId: newAcct.$id, email, username, avatar: avatarUrl }
    );
    console.log(newUser, 'new user');
    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error creating user');
      throw new Error(error.message);
    }
  }
};

const signin = async ({ email, password }: Omit<User, 'name'>) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error creating user session');
      throw new Error(error.message);
    }
  }
};
const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments<CurrentUser>(
      databaseId,
      usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    const user = currentUser.documents[0];
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error creating user session');
      throw new Error(error.message);
    }
  }
};
const getVideos = async () => {
  try {
    const videos = await databases.listDocuments<Video>(
      databaseId,
      videosCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    if (!videos) throw Error;
    return videos.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while fetching videos');
      throw new Error(error.message);
    }
  }
};
const getLatestVideos = async () => {
  try {
    const videos = await databases.listDocuments<Video>(
      databaseId,
      videosCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    );
    if (!videos) throw Error;
    return videos.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while fetching videos');
      throw new Error(error.message);
    }
  }
};
const getVideosBySearch = async (query: string) => {
  try {
    const videos = await databases.listDocuments<Video>(
      databaseId,
      videosCollectionId,
      [Query.search('title', query)]
    );
    if (!videos) throw Error;
    return videos.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while fetching videos');
      throw new Error(error.message);
    }
  }
};
const getSavedVideos = async (userId: string, searchQuery?: string) => {
  try {
    const queries = [
      Query.equal('saved', true),
      Query.equal('savedBy', userId),
    ];
    if (searchQuery) {
      queries.push(Query.search('title', searchQuery));
    }
    const videos = await databases.listDocuments<Video>(
      databaseId,
      videosCollectionId,
      queries
    );

    if (!videos) throw Error;
    return videos.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while fetching saved videos');
      throw new Error(error.message);
    }
  }
};
const getUserVideos = async (userId: string) => {
  try {
    const videos = await databases.listDocuments<Video>(
      databaseId,
      videosCollectionId,
      [Query.equal('authorId', userId), Query.orderDesc('$createdAt')]
    );
    if (!videos) throw Error;
    return videos.documents;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while fetching users videos');
      throw new Error(error.message);
    }
  }
};
const getFilePreview = (fileId: string, type: 'video' | 'image') => {
  let fileUrl: URL;
  try {
    if (type === 'image') {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else if (type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId);
    } else {
      throw Error('Invalid file type');
    }
    if (!fileUrl) throw Error('File not found');
    return fileUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while generating files preview');
      throw new Error(error.message);
    }
  }
};
const uploadFile = async (
  file: ImagePickerAsset | null,
  type: 'video' | 'image'
) => {
  if (!file) return;
  const { mimeType, fileName, fileSize, uri } = file;
  const asset = {
    type: mimeType as string,
    name: fileName as string,
    size: fileSize as number,
    uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    return getFilePreview(uploadedFile.$id, type);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while uploading files to storage');
      throw new Error(error.message);
    }
  }
};
const createPost = async (form: Post) => {
  const { prompt, title, thumbnail, video, authorId } = form;
  try {
    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadFile(video, 'video'),
      uploadFile(thumbnail, 'image'),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      videosCollectionId,
      ID.unique(),
      {
        title,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        prompt,
        authorId,
      }
    );
    return newPost;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error while sending users post');
      throw new Error(error.message);
    }
  }
};
const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, 'error logging user out');
      throw new Error(error.message);
    }
  }
};
export {
  createPost,
  createUser,
  getCurrentUser,
  getLatestVideos,
  getSavedVideos,
  getUserVideos,
  getVideos,
  getVideosBySearch,
  logout,
  signin,
};
