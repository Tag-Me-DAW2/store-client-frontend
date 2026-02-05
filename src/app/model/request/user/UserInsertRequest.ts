export interface UserInsertRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture: string | null;
  profilePictureName: string | null;
}
