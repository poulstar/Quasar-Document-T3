<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create New User</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="createUserParameter.username"
          label="Enter Your User Name"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="createUserParameter.email"
          label="Enter Your E-Mail"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          type="password"
          dense
          v-model:model-value="createUserParameter.password"
          label="Enter Your Password"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-file
          filled
          bottom-slots
          v-model:model-value="createUserParameter.avatar"
          label="Avatar"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="createUserParameter.avatar = null"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint> File Size </template>
        </q-file>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="createUserParameter.role"
          :options="options"
          label="Role"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="red" icon-right="close" label="Cancel" @click="close" />
        <q-btn
          color="light-blue-8"
          icon-right="create"
          label="Create"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  modal: {
    default: false,
  },
});

const options = ref(['admin', 'user']);

const createUserParameter = ref({
  username: '',
  email: '',
  password: '',
  avatar: undefined,
  role: 'user',
});

const emit = defineEmits(['update:modal']);

const close = () => {
  emit.call(this, 'update:modal', false);
};
const accepted = () => {
  console.log(
    createUserParameter.value.username,
    createUserParameter.value.email,
    createUserParameter.value.password,
    createUserParameter.value.avatar,
    createUserParameter.value.role
  );
  emit.call(this, 'update:modal', false);
};
</script>
