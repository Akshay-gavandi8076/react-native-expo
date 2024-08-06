import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite'
export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.ak.aora',
  projectId: '66abb0e70001ae5cb250',
  databaseId: '66abb28d00263f273c36',
  userCollectionId: '66abb2b70006c315c34b',
  videoCoolectionId: '66abb2d4003de558d3a5',
  storageId: '66abb41f000cd08c17aa',
}

// Init your React Native SDK
const client = new Client()

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
const database = new Databases(client)

export const createUser = async ({ email, password, username }: any) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await database.createDocument(
      config.userCollectionId,
      config.databaseId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    )
  } catch (error) {
    console.error(error)
  }
}

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const session = await account.createSession(email, password)
  } catch (error: any) {
    throw new Error(error)
  }
}
