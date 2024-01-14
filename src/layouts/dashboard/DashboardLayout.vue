<template>
  <q-layout view="hHh LpR fFf" class="auth-background">
    <q-header elevated :class="'text-white header'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="../../../public/images/logo.png" />
          </q-avatar>
          Menu
        </q-toolbar-title>
        <q-select
          v-model="navBarSelect"
          :options="navBarOptions"
          :hide-dropdown-icon="true"
          :hide-selected="true"
        >
          <template v-slot:append>
            <q-avatar>
              <span class="material-icons">palette</span>
            </q-avatar>
          </template>
        </q-select>
        <q-toggle v-model="darkMode" color="black" @click="themeMode" />
        <span>Profile</span>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
    >
      <!-- drawer content -->
      <q-list separator>
        <q-item
          v-for="(item, index) in accessMenu"
          :key="index"
          :to="{ name: item.route }"
          v-ripple
          clickable
        >
          <q-avatar><q-icon :name="item.icon"></q-icon></q-avatar>
          <q-item-section>
            <q-item-label class="q-ml-sm"> {{ item.name }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      behavior="mobile"
      elevated
    >
      <!-- drawer content -->
      <div class="avatarBox row items-center justify-center">
        <q-avatar size="150px" class="overlapping">
          <q-img :src="profileTemp.avatar"></q-img>
        </q-avatar>
      </div>
      <div class="q-pa-md row items-start q-gutter-md justify-center">
        <q-card flat bordered class="my-card text-center">
          <q-card-section>
            <div class="text-h3">Profile</div>
          </q-card-section>
          <q-separator inset />

          <q-card-section class="q-pt-none">
            <div class="text-h6">User Name</div>
            {{ profileTemp.username }}
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pt-none">
            <div class="text-h6">E-Mail</div>
            {{ profileTemp.email }}
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md q-gutter-sm text-center">
        <q-btn
          class="full-width"
          label="Update"
          color="light-blue-8"
          @click="profile.modal = true"
        />
        <q-btn
          class="full-width"
          label="Logout"
          color="red"
          @click="logout()"
        />

        <q-dialog v-model="profile.modal" persistent>
          <q-card style="width: 350px">
            <q-card-section>
              <div class="text-h6">Update Profile</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="profile.username"
                label="Your User Name"
                ref="nameState"
                :error="nameError.length > 0"
                :error-message="nameError"
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="profile.email"
                label="Your E-Mail"
                ref="emailState"
                :error="emailError.length > 0"
                :error-message="emailError"
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input
                v-model="profile.password"
                dense
                label="Your Password"
                ref="passwordState"
                :error="passwordError.length > 0"
                :error-message="passwordError"
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-file
                filled
                bottom-slots
                v-model="profile.newAvatar"
                label="Label"
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
                    @click.stop.prevent="profile.newAvatar = null"
                    class="cursor-pointer"
                  />
                </template>

                <template v-slot:hint> File Size </template>
              </q-file>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Submit" @click="update()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch } from 'vue';
import { accessMenu } from 'components/ts/MenuComponent';
import { profileTemp, profile, userData } from 'components/ts/ProfileComponent';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';
import { User } from 'src/models/user';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    userData();
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const avatarError = ref('');

    const nameState = ref(null);
    const emailState = ref(null);
    const passwordState = ref(null);
    const avatarState = ref(null);

    const $q = useQuasar();
    const darkMode = ref(false);

    const navBarSelect = ref('');
    const navBarOptions = ['Default', 'RGB', 'Primary', 'Dark'];
    const navBarClass = ref('');
    watch(navBarSelect, () => {
      if (navBarSelect.value === 'RGB') {
        navBarClass.value = 'RGB';
      } else if (navBarSelect.value === 'Primary') {
        navBarClass.value = 'Primary';
      } else if (navBarSelect.value === 'Dark') {
        navBarClass.value = 'Dark';
      } else {
        navBarClass.value = 'Default';
      }
    });

    return {
      navBarClass,
      navBarSelect,
      navBarOptions,

      darkMode,

      nameError,
      emailError,
      passwordError,
      avatarError,

      nameState,
      emailState,
      passwordState,
      avatarState,

      profile,

      accessMenu,
      profileTemp,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
      update() {
        User.updateProfile(
          profile.value.id,
          profile.value.username,
          profile.value.email,
          profile.value.password,
          profile.value.newAvatar
        ).then(
          (response) => {
            if (response.status == 200) {
              userData();
              profile.value.modal = !profile.value.modal;
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
      },
      logout() {
        authStore.logout();
        router.replace({ name: 'login' });
      },
      themeMode() {
        if ($q.dark.mode == false) {
          $q.dark.set(true);
        } else {
          $q.dark.set(false);
        }
      },
    };
  },
};
</script>
<style>
.header {
  animation: v-bind(navBarClass) 5s alternate infinite linear;
}
.RGB {
  animation: RGB 5s alternate infinite linear;
}
@keyframes RGB {
  0% {
    background-color: red;
  }
  50% {
    background-color: green;
  }
  100% {
    background-color: blue;
  }
}
.Primary {
  animation: Primary 5s alternate infinite linear;
}
@keyframes Primary {
  0% {
    background-color: #caf0f8;
  }
  12% {
    background-color: #ade8f4;
  }
  24% {
    background-color: #90e0ef;
  }
  36% {
    background-color: #48cae4;
  }
  48% {
    background-color: #00b4d8;
  }
  60% {
    background-color: #0096c7;
  }
  72% {
    background-color: #0077b6;
  }
  84% {
    background-color: #023e8a;
  }
  100% {
    background-color: #03045e;
  }
}

.Dark {
  animation: Dark 5s alternate infinite linear;
}
@keyframes Dark {
  0% {
    background-color: #f8f9fa;
  }
  12% {
    background-color: #e9ecef;
  }
  24% {
    background-color: #dee2e6;
  }
  36% {
    background-color: #ced4da;
  }
  48% {
    background-color: #adb5bd;
  }
  60% {
    background-color: #6c757d;
  }
  72% {
    background-color: #495057;
  }
  84% {
    background-color: #343a40;
  }
  100% {
    background-color: #212529;
  }
}
</style>
