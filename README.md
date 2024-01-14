# پیاده سازی ویرایش کل کاربر ها برای admin و اجرا API آن همراه با Input Validation


###### برای اینکه بتوانیم کاربر ها را ویرایش کنیم و دسترسی برای مدیر سایت فراهم باشد، اول باید در مدل User تابع static را می نویسیم تا بتوان به سرور متناسب با الگو آن درخواست داد.
```bash
static async updateUserByAdmin(
  id: number,
  username: string,
  email: string,
  password: string,
  avatar: File,
  role: string
) {
  const data = new FormData();
  data.append('name', username);
  data.append('email', email);
  data.append('password', password);
  data.append('avatar', avatar);
  data.append('role', role);
  const response = await api.post<AxiosResponse>(
    `api/update-user-by-admin/${id}`,
    data
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Update Failed');
}
```
###### حال نوبت آن رسیده تا component خود را یعنی AdminUpdateUser را ویرایش کنیم و این کا را از script شروع می کنیم. ابتدا مدل User خود را import می کنیم.
```bash
import { User } from 'src/models/user';
```
###### سپس نوبت آن است که refresh را به props اضافه کنیم.
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```
###### برای اینکه هر input ما بتواند خطا مربوط به خود را نشان دهد، نیاز داریم تا متغیر های آن را بسازیم.
```bash
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
```
###### به updateUserParameter خود id اضافه می کنیم
```bash
const updateUserParameter = ref({
  id: 0,
  username: '',
  email: '',
  password: '',
  avatar: undefined,
  role: 'user',
});
```
###### در گام بعدی watch خود را هم بروز می کنیم.
```bash
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
```
###### در گام بعدی در تابع accepted دستور می دهیم قوانین ما بررسی شود و بعد اینکه بررسی شد وارد مرحله بعدی می شویم.
```bash
nameState.value.validate();
emailState.value.validate();
passwordState.value.validate();
roleState.value.validate();
```
###### شرط خود را می نویسیم که اگر مواردی که برای ما اهمیت دارد، قوانین پر شدنش رعایت نشده بود، چاپ کند که فرم باید کامل شود، در غیر این صورت درخواست ویرایش کاربر را به سمت سرور ارسال کند. اگر از سمت سرور جواب 200 بود لیست را بروز می کنیم و dialog را می بندیم و اگر خطا داشت، خطا ها را به مدت 5 ثانیه نمایش می دهیم.

```bash
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
```
###### حال نوبت آن است که سراغ input های موجود در template برویم و قوانین خود را بر آن ها اعمال کنیم.

###### مواردی که نیاز است برای q-input مربوط به name اضافه کنیم.
```bash
ref="nameState"
:error="nameError.length > 0"
:error-message="nameError"
:rules="[
  (val) => !!val || 'Required',
  (val) => val.length > 3 || 'Please use minimum 4 character',
  (val) => val.length <= 100 || 'Please use maximum 100 character',
]"
lazy-rules
```

###### مواردی که نیاز است برای q-input مربوط به email اضافه کنیم.
```bash
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
```

###### مواردی که نیاز است برای q-input مربوط به password اضافه کنیم.
```bash
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
```

###### مواردی که نیاز است برای q-file مربوط به avatar اضافه کنیم.
```bash
ref="avatarState"
:error="avatarError.length > 0"
:error-message="avatarError"
```

###### مواردی که نیاز است برای q-select مربوط به role اضافه کنیم.
```bash
ref="roleState"
:error="roleError.length > 0"
:error-message="roleError"
:rules="[(val) => !!val || 'Required']"
lazy-rules
```


###### حال نوبت آن است که به فایل AllUserPage برویم و component خود را یعنی AdminUpdateUser را ویرایش کنیم.

```bash
<AdminUpdateUser
  v-model:modal="updateUserParameter.modal"
  v-model:data="updateUserParameter"
  :refresh="onRequest"
></AdminUpdateUser>
```




