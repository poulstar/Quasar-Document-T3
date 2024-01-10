import { api } from 'src/boot/axios';
import { FetchResponse } from 'src/models/types';
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
}
