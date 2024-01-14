<template>
  <q-dialog :model-value="props.modal" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Update User</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="updateUserParameter.username"
          label="Enter Your User Name"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="updateUserParameter.email"
          label="Enter Your E-Mail"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          type="password"
          dense
          v-model:model-value="updateUserParameter.password"
          label="Enter Your Password"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-file
          filled
          bottom-slots
          v-model:model-value="updateUserParameter.avatar"
          label="Avatar"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="updateUserParameter.avatar = null"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint> File Size </template>
        </q-file>
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="updateUserParameter.role"
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
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
});

const options = ref(['admin', 'user']);

const updateUserParameter = ref({
  username: '',
  email: '',
  password: '',
  avatar: undefined,
  role: 'user',
});

watch(props, () => {
  updateUserParameter.value = {
    username: props.data.name,
    email: props.data.email,
    password: props.data.password,
    avatar: updateUserParameter.value.avatar,
    role: props.data.role,
  };
});

const emit = defineEmits(['update:modal']);

const close = () => {
  emit.call(this, 'update:modal', false);
};
const accepted = () => {
  console.log(
    updateUserParameter.value.username,
    updateUserParameter.value.email,
    updateUserParameter.value.password,
    updateUserParameter.value.avatar,
    updateUserParameter.value.role
  );
  emit.call(this, 'update:modal', false);
};
</script>
