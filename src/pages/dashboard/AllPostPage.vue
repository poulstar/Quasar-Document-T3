<template>
  <div class="q-pa-md q-mb-lg overflow-auto window-height">
    <q-table
      :grid="$q.screen.xs"
      title="All Posts"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :rows-per-page-options="[pagination.rowsPerPage]"
      v-model:pagination="pagination"
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
  <AdminUpdatePost
  v-model:modal="updatePostParameter.modal"
  v-model:data="updatePostParameter"
  ></AdminUpdatePost>
  <AdminDeletePost
  v-model:modal="deletePostParameter.modal"
  v-model:data="deletePostParameter"
  ></AdminDeletePost>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { columns, rows, pagination } from 'components/ts/AllPostComponent';
import AdminUpdatePost from 'components/vue/AdminUpdatePost.vue';
import AdminDeletePost from 'components/vue/AdminDeletePost.vue';

const filter = ref('');

const updatePostParameter = ref({
  modal: <boolean> false,
  id: <number>0,
  title: <string>'',
  description: <string>'',
});
const deletePostParameter = ref({
  modal: <boolean> false,
  id: <number>0,
  image: <string>'',
  title: <string>'',
  username: <string>'',
  description: <string>'',
});

const updatePost = (row: any) => {
  updatePostParameter.value.id = row.id;
  updatePostParameter.value.title = row.title;
  updatePostParameter.value.description = row.description;
  updatePostParameter.value.modal = !updatePostParameter.value.modal
};

const deletePost = (row: any) => {
  deletePostParameter.value.id = row.id;
  deletePostParameter.value.image = row.image;
  deletePostParameter.value.title = row.title;
  deletePostParameter.value.username = row.username.name;
  deletePostParameter.value.description = row.description;
  deletePostParameter.value.modal = !deletePostParameter.value.modal
};
</script>
