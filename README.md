# پیاده سازی افزودن کل کاربر ها برای admin و اجرا API آن همراه با Input Validation


###### اولین گام را دوباره بر می داریم و مطابق الگویی که سرور مشخص کرده یک تابع static برای ساخت یک کاربر توسط مدیر سایت را می سازیم. وارد فایل user می شویم و قطعه کد زیر را در آن می نویسیم.
```bash
static async createUserByAdmin(
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
    'api/create-user-by-admin',
    data
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Created Failed');
}
```
###### در مرحله بعدی وارد AdminCreateUser می شویم و از بخش script شروع می کنیم به اصلاح. اولین کاری که می کنیم ابتدا مدل User را import می کنیم.
```bash
import { User } from 'src/models/user';
```
###### افزودن refresh در props گام بعدی است.
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  refresh: {},
});
```
###### در گام بعدی ما نیاز داریم تا مقادیر input ها بررسی شوند و در صورت بر قرار نبودن قوانین ما، خطا نمایش دهد.

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
###### گام بعدی نوبت این است که تابع accepted را ویرایش کنیم و مواردی که لازم است در آن پیاده سازی کنیم.
###### ابتدا قوانین خود را فراخوان می کنیم تا بررسی شود قوانین ما رعایت شده است یا خیر.
```bash
nameState.value.validate();
emailState.value.validate();
passwordState.value.validate();
avatarState.value.validate();
roleState.value.validate();
```
###### گام بعدی نوبت این است که بررسی کنیم آیا قوانین ما رعایت شده است یا خیر. اگر مشکلی در ورودی ها نبود درخواستی به سمت سرور می فرستیم تا کاربر ما ساخته شود و در غیر این صورت برای کاربر چاپ می کنیم که فرم خود را کامل کند.

```bash
if (
  nameState.value.hasError ||
  emailState.value.hasError ||
  passwordState.value.hasError ||
  avatarState.value.hasError ||
  roleState.value.hasError
) {
  console.log('please Complete Form Data');
} else {
  User.createUserByAdmin(
    createUserParameter.value.username,
    createUserParameter.value.email,
    createUserParameter.value.password,
    createUserParameter.value.avatar,
    createUserParameter.value.role
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
###### وقتی درخواست را ارسال می کنیم، اگر از سمت سرور خطایی در فرم ما وجود داشته باشد، آن ها را به مدت 5 ثانیه  به نمایش در می آوریم.
###### حال نوبت آن رسیده است که در بخش template اصلاحاتی به وجود آوریم.
###### کد هایی که لازم است برای q-input مربوط به name به صورت زیر به آن اضافه می کنیم.
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
hint="You can use your first name or last name or nick name"
@keyup.enter="accepted"
```
###### کد هایی که لازم است برای q-input مربوط به email به صورت زیر به آن اضافه می کنیم.
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
hint="enter a gmail or live or cloud or yahoo and etc account"
@keyup.enter="accepted"
```
###### تابع email جزء تابع های quasar است که برای شما بررسی می کند که آیا email وارد شده معتبر است یا خیر.
###### کد هایی که لازم است برای q-input مربوط به password به صورت زیر به آن اضافه می کنیم.
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
hint="Enter your password that includes numbers, uppercase and lowercase letters, and symbols"
@keyup.enter="accepted"
```
###### تابع test تابعی است که وقتی شما ما قبل آن یک regex تعیین می کنید، بررسی می کند و تایید یا عدم تایید وجود مواردی که شما خواستید را باز می گرداند.
###### کد هایی که لازم است برای q-file مربوط به avatar به صورت زیر به آن اضافه می کنیم.
```bash
ref="avatarState"
:error="avatarError.length > 0"
:error-message="avatarError"
:rules="[(val) => !!val || 'Required']"
lazy-rules
hint="set a favorite image for your avatar"
@keyup.enter="accepted"
```
###### کد هایی که لازم است برای q-select مربوط به role به صورت زیر به آن اضافه می کنیم.
```bash
ref="roleState"
:error="roleError.length > 0"
:error-message="roleError"
:rules="[(val) => !!val || 'Required']"
lazy-rules
hint="select user or admin role"
@keyup.enter="accepted"
```
###### در موارد فوق دو مورد وجود داشت که جدید بود. یکی اینکه از hint استفاده کردیم که برای راهنمایی کاربر از آن استفاده می شود. و دیگری @keyup.enter است که برای رابط کاربری  بهتر از آن استفاده می شود. یعنی وقتی کاربر input را پر کرد یا به عبارتی در حالت focus است، می تواند با فشردن enter درخواست خود را ارسال کند.

###### حال نوبت آن است که وارد AllUserPage شویم و در بخش template بر روی component مورد نظر خود یعنی AdminCreateUser مقدار refresh را اضافه کنیم.
```bash
<AdminCreateUser
  v-model:modal="createUserParameter.modal"
  :refresh="onRequest"
></AdminCreateUser>
```
###### حال همه چی برای افزودن یک کاربر توسط مدیر سایت فراهم است و می توانید از آن استفاده کنید.





