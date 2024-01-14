import { ref } from 'vue';
import { Post } from 'src/models/post';

const posts = ref();
const refresh = () => {
  Post.allPostInDashboard(1,1000)
  .then(
    (response)=>{
      posts.value = response.posts;
    }
  )
};

export {posts, refresh}


