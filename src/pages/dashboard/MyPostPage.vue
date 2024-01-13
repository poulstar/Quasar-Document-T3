<template>
  <div class="q-pa-md q-mb-lg overflow-auto window-height">
    <q-table
      :grid="$q.screen.xs"
      title="My Posts"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :rows-per-page-options="[pagination.rowsPerPage]"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input
          class="bg-white"
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          label="Create New Post"
          color="light-blue-8"
          class="q-ml-md"
          @click="createPost()"
        />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width> Tools </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn
              class="q-ma-sm"
              size="md"
              color="warning"
              dense
              icon="update"
              @click="updatePost(props.row)"
            />
            <q-btn
              class="q-ma-sm"
              size="md"
              color="red"
              dense
              icon="delete"
              @click="deletePost(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <UserCreatePost
    v-model:modal="createPostParameter.modal"
    :refresh="onRequest"
  ></UserCreatePost>
  <UserUpdatePost
    v-model:modal="updatePostParameter.modal"
    v-model:data="updatePostParameter"
    :refresh="onRequest"
  ></UserUpdatePost>
  <UserDeletePost
    v-model:modal="deletePostParameter.modal"
    v-model:data="deletePostParameter"
    :refresh="onRequest"
  ></UserDeletePost>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  columns,
  rows,
  pagination,
  onRequest,
} from 'components/ts/MyPostComponent';
import UserCreatePost from 'components/vue/UserCreatePost.vue';
import UserUpdatePost from 'components/vue/UserUpdatePost.vue';
import UserDeletePost from 'components/vue/UserDeletePost.vue';
import { profileTemp } from 'components/ts/ProfileComponent';

const filter = ref('');

const createPostParameter = ref({
  modal: <boolean>false,
});
const updatePostParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  title: <string>'',
  description: <string>'',
  latitude: <number>37.28,
  longitude: <number>49.6,
});
const deletePostParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  image: <string>'',
  title: <string>'',
  username: <string>'',
  description: <string>'',
  latitude: <number>37.28,
  longitude: <number>49.6,
});

const createPost = () => {
  createPostParameter.value.modal = !createPostParameter.value.modal;
};

const updatePost = (row: any) => {
  updatePostParameter.value.id = row.id;
  updatePostParameter.value.title = row.title;
  updatePostParameter.value.description = row.description;
  updatePostParameter.value.latitude = row.latitude;
  updatePostParameter.value.longitude = row.longitude;
  updatePostParameter.value.modal = !updatePostParameter.value.modal;
};

const serverRoute = 'https://openapi.poulstar.org/';

const deletePost = (row: any) => {
  deletePostParameter.value.id = row.id;
  deletePostParameter.value.image = serverRoute + row.media[0].url;
  deletePostParameter.value.title = row.title;
  deletePostParameter.value.username = profileTemp.value.username;
  deletePostParameter.value.description = row.description;
  deletePostParameter.value.latitude = row.latitude;
  deletePostParameter.value.longitude = row.longitude;
  deletePostParameter.value.modal = !deletePostParameter.value.modal;
};
</script>
