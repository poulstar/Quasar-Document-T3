import { ref } from 'vue';
import { Post } from 'src/models/post';

const posts = ref();
const top_posts = ref();
const refresh = () => {
  Post.allPostInDashboard(
    pagination.value.current_page,
    pagination.value.per_page
  ).then((response) => {
    posts.value = response.posts;
    pagination.value.current_page = response.page_data.current_page;
    pagination.value.last_page = response.page_data.last_page;
    top_posts.value = response.top_post;
  });
};

const pagination = ref({
  current_page: 1,
  last_page: 4,
  per_page: 4,
});

export { posts, refresh, pagination, top_posts };
