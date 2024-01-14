import { ref } from 'vue';
import { User } from 'src/models/user';

const serverRoute = 'https://openapi.poulstar.org/';

const userData = () => {
  User.profile().then((response) => {
    profile.value.id = response.data.user.id;
    profileTemp.value.id = response.data.user.id;
    profile.value.username = response.data.user.name;
    profileTemp.value.username = response.data.user.name;
    profile.value.email = response.data.user.email;
    profileTemp.value.email = response.data.user.email;
    if (response.data.user.media[0]?.url) {
      profile.value.avatar = serverRoute + response.data.user.media[0]?.url;
      profileTemp.value.avatar = serverRoute + response.data.user.media[0]?.url;
    }
    profile.value.role = response.data.user.roles[0].name;
    profileTemp.value.role = response.data.user.roles[0].name;
  });
};
userData();

const profile = ref({
  modal: false,
  id: 0,
  username: '',
  email: '',
  avatar: 'images/avatar.png',
  newAvatar: undefined,
  password: '',
  role: '',
});

const profileTemp = ref({
  modal: false,
  id: 0,
  username: 'hossein pourghadiri',
  email: 'hossein@gmail.com',
  avatar: '../../../public/images/avatar.png',
  newAvatar: undefined,
  password: '',
  role: 'user',
});

export { profileTemp, profile, userData };
