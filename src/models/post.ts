import { api } from 'src/boot/axios';
import { FetchResponse } from 'src/models/types';
import { AxiosResponse } from 'axios';

export class Post {
  static async myPosts(page: number, filter: string) {
    const response = await api.get<FetchResponse<Post>>(
      `api/my-posts?page=${page}&filter=${filter ?? ''}`
    );
    if (response.status == 200) {
      return response;
    }
    throw Error('My Posts failed');
  }

  static async createPost(
    title: string,
    description: string,
    image: File,
    latitude: number,
    longitude: number
  ) {
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image', image);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    const response = await api.post<AxiosResponse>('api/create-post', data);
    if (response.status == 200) {
      return response;
    }
    throw Error('Created Failed');
  }
}
