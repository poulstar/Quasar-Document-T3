import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';
import { FetchResponse } from 'src/models/types';

export class User {
  static async register(
    username: string,
    email: string,
    password: string,
    avatar: File
  ) {
    const data = new FormData();
    data.append('name', username);
    data.append('email', email);
    data.append('password', password);
    data.append('avatar', avatar);
    const response = await api.post<AxiosResponse>('api/register', data);
    if (response.status == 200) {
      return response;
    }
    throw Error('Register Failed');
  }

  static async profile() {
    const response = await api.get('api/user/profile');
    if (response.status == 200) {
      return response;
    }
    throw Error('Profile failed');
  }

  static async updateProfile(
    id: number,
    username: string,
    email: string,
    password: string,
    avatar: File
  ) {
    const data = new FormData();
    data.append('name', username);
    data.append('email', email);
    data.append('password', password);
    data.append('avatar', avatar);
    const response = await api.post<AxiosResponse>(
      `api/update-my-profile/${id}`,
      data
    );
    if (response.status == 200) {
      return response;
    }
    throw Error('Update Failed');
  }

  static async allUserForAdmin(page: number, filter: string) {
    const response = await api.get<FetchResponse<User>>(
      `api/all-users?page=${page}&filter=${filter ?? ''}`
    );
    if (response.status == 200) {
      return response;
    }
    throw Error('Get All User For Admin Failed');
  }
}
