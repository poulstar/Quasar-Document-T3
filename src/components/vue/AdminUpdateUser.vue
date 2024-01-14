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
          ref="nameState"
          :error="nameError.length > 0"
          :error-message="nameError"
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length > 3 || 'Please use minimum 4 character',
            (val) => val.length <= 100 || 'Please use maximum 100 character',
          ]"
          lazy-rules
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model:model-value="updateUserParameter.email"
          label="Enter Your E-Mail"
          ref="emailState"
          :error="emailError.length > 0"
          :error-message="emailError"
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length > 3 || 'Please use minimum 4 character',
            (val) => val.length <= 100 || 'Please use maximum 100 character',
            (val, rules) =>
              rules.email(val) || 'Please enter a valid email address',
          ]"
          lazy-rules
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          type="password"
          dense
          v-model:model-value="updateUserParameter.password"
          label="Enter Your Password"
          ref="passwordState"
          :error="passwordError.length > 0"
          :error-message="passwordError"
          :rules="[
            (val) => !!val || 'Required',
            (val) => val.length > 3 || 'Please use minimum 4 character',
            (val) => val.length <= 100 || 'Please use maximum 100 character',
            (val) =>
              /[a-z]/.test(val) ||
              'Enter lower case character in your password',
            (val) =>
              /[A-Z]/.test(val) ||
              'Enter upper case character in your password',
            (val) => /[0-9]/.test(val) || 'Enter number in your password',
            (val) => /[~!@#$%^&*]/.test(val) || 'Enter symbol in your password',
          ]"
          lazy-rules
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-file
          filled
          bottom-slots
          v-model:model-value="updateUserParameter.avatar"
          label="Avatar"
          counter
          ref="avatarState"
          :error="avatarError.length > 0"
          :error-message="avatarError"
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
          ref="roleState"
          :error="roleError.length > 0"
          :error-message="roleError"
          :rules="[(val) => !!val || 'Required']"
          lazy-rules
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="red" icon-right="close" label="Cancel" @click="close" />
        <q-btn
          color="light-blue-8"
          icon-right="create"
          label="Update"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { User } from 'src/models/user';

const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});

const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const avatarError = ref('');
const roleError = ref('');

const nameState = ref(null);
const emailState = ref(null);
const passwordState = ref(null);
const avatarState = ref(null);
const roleState = ref(null);

const options = ref(['admin', 'user']);

const updateUserParameter = ref({
  id: 0,
  username: '',
  email: '',
  password: '',
  avatar: undefined,
  role: 'user',
});

watch(props, () => {
  updateUserParameter.value = {
    id: props.data.id,
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
  nameState.value.validate();
  emailState.value.validate();
  passwordState.value.validate();
  roleState.value.validate();

  if (
    nameState.value.hasError ||
    emailState.value.hasError ||
    passwordState.value.hasError ||
    roleState.value.hasError
  ) {
    console.log('please Complete Form Data');
  } else {
    User.updateUserByAdmin(
      updateUserParameter.value.id,
      updateUserParameter.value.username,
      updateUserParameter.value.email,
      updateUserParameter.value.password,
      updateUserParameter.value.avatar,
      updateUserParameter.value.role
    ).then(
      (response) => {
        if (response.status == 200) {
          props.refresh();
          emit.call(this, 'update:modal', false);
        }
      },
      (reject) => {
        if (reject.response.status != 200) {
          if (reject.response.data.errors) {
            nameError.value =
              reject.response.data.errors?.name?.toString() ?? '';
            emailError.value =
              reject.response.data.errors?.email?.toString() ?? '';
            passwordError.value =
              reject.response.data.errors?.password?.toString() ?? '';
            avatarError.value =
              reject.response.data.errors?.avatar?.toString() ?? '';
            setTimeout(() => {
              nameError.value = '';
              emailError.value = '';
              passwordError.value = '';
              avatarError.value = '';
            }, 5000);
          }
        }
      }
    );
  }
};
</script>
