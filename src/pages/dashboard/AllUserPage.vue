<template>
  <div class="q-pa-md q-mb-lg overflow-auto window-height">
    <q-table
      :grid="$q.screen.xs"
      title="All Users"
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
          label="Create New User"
          color="light-blue-8"
          class="q-ml-md"
          @click="createUser()"
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
              @click="updateUser(props.row)"
            />
            <q-btn
              class="q-ma-sm"
              size="md"
              color="red"
              dense
              icon="delete"
              @click="deleteUser(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <AdminCreateUser
    v-model:modal="createUserParameter.modal"
    :refresh="onRequest"
  ></AdminCreateUser>
  <AdminUpdateUser
    v-model:modal="updateUserParameter.modal"
    v-model:data="updateUserParameter"
    :refresh="onRequest"
  ></AdminUpdateUser>
  <AdminDeleteUser
    v-model:modal="deleteUserParameter.modal"
    v-model:data="deleteUserParameter"
    :refresh="onRequest"
  ></AdminDeleteUser>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  columns,
  rows,
  pagination,
  onRequest,
} from 'components/ts/AllUserComponent';
import AdminCreateUser from 'components/vue/AdminCreateUser.vue';
import AdminUpdateUser from 'components/vue/AdminUpdateUser.vue';
import AdminDeleteUser from 'components/vue/AdminDeleteUser.vue';

const filter = ref('');

const createUserParameter = ref({
  modal: <boolean>false,
});
const updateUserParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  name: <string>'',
  email: <string>'',
  role: <string>'',
});
const deleteUserParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  name: <string>'',
});

const createUser = () => {
  createUserParameter.value.modal = !createUserParameter.value.modal;
};

const updateUser = (row: any) => {
  updateUserParameter.value.id = row.id;
  updateUserParameter.value.name = row.name;
  updateUserParameter.value.email = row.email;
  updateUserParameter.value.role = row.roles[0].name;
  updateUserParameter.value.modal = !updateUserParameter.value.modal;
};

const deleteUser = (row: any) => {
  deleteUserParameter.value.id = row.id;
  deleteUserParameter.value.name = row.name;
  deleteUserParameter.value.modal = !deleteUserParameter.value.modal;
};
</script>
