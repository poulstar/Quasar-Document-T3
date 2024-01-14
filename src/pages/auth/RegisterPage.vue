<template>
  <q-page-container>
    <q-page class="window-height window-width row justify-center items-center">
      <div class="column">
        <div class="row">
          <h5 class="text-h5 text-white q-my-md">Register To Open World</h5>
        </div>
        <div class="row">
          <q-card square bordered class="q-pa-lg w-400">
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input
                  v-model="registerParameters.name"
                  square
                  filled
                  clearable
                  type="text"
                  label="First Name and Last Name"
                  ref="nameState"
                  :error="nameError.length > 0"
                  :error-message="nameError"
                />
                <q-input
                  v-model="registerParameters.email"
                  square
                  filled
                  clearable
                  type="email"
                  label="Email"
                  ref="emailState"
                  :error="emailError.length > 0"
                  :error-message="emailError"
                />
                <q-input
                  v-model="registerParameters.password"
                  square
                  filled
                  clearable
                  type="password"
                  label="Password"
                  ref="passwordState"
                  :error="passwordError.length > 0"
                  :error-message="passwordError"
                />
                <q-file
                  v-model="registerParameters.avatar"
                  filled
                  bottom-slots
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
                      @click.stop.prevent="registerParameters.avatar = null"
                      class="cursor-pointer"
                    />
                  </template>

                  <template v-slot:hint> File Size </template>
                </q-file>
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn
                @click="register()"
                unelevated
                color="light-blue-8"
                size="lg"
                class="full-width q-ma-sm"
                label="Register"
              />
              <q-btn
                @click="login()"
                unelevated
                color="red"
                size="lg"
                class="full-width"
                label="login"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none"> </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User } from 'src/models/user';

const registerParameters = ref({
  name: '',
  email: '',
  password: '',
  avatar: [],
});
const register = () => {
  User.register(
    registerParameters.value.name,
    registerParameters.value.email,
    registerParameters.value.password,
    registerParameters.value.avatar
  ).then(
    (response) => {
      if (response.status == 200) {
        setTimeout(() => {
          router.replace({ name: 'login' });
        }, 1000);
      }
    },
    (reject) => {
      if (reject.response.status != 200) {
        if (reject.response.data.errors) {
          nameError.value = reject.response.data.errors?.name?.toString() ?? '';
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
};

const router = useRouter();
const login = () => {
  router.replace({ name: 'login' });
};

const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const avatarError = ref('');

const nameState = ref(null);
const emailState = ref(null);
const passwordState = ref(null);
const avatarState = ref(null);
</script>
