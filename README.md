# پیاده سازی افزودن پست خود و اجرا API آن همراه با Input Validation


###### برای اینکه در راستای کامل کردن ساخت یک پست همه امکانات را فراهم کنیم، لازم است گام به گام جلو برویم. اول در مدل Post تابعی که درخواست را به سرور جهت دریافت داده ارسال می کند را می سازیم.

###### ابتدا در بالای صفحه AxiosResponse را import می کنیم.

```bash
import { AxiosResponse } from 'axios';
```
###### سپس در مدل تابع مورد نیاز را می سازیم.

```bash
static async createPost(
  title: string,
  description: string,
  image: File,
  latitude: number,
  longitude: number
) {
  const data = new FormData();
  data.append('title', title);
  data.append('description', description);
  data.append('image', image);
  data.append('latitude', latitude);
  data.append('longitude', longitude);
  const response = await api.post<AxiosResponse>('api/create-post', data);
  if (response.status == 200) {
    return response;
  }
  throw Error('Created Failed');
}
```
###### تابع خود را از نوع static می سازیم و در آن مقادیری که سرور از خواسته دریافت می کنیم و در قالب یک from data برای آن ارسال می کنیم. وقتی جواب بازگشت، آن را به سوی استفاده کننده از تابع باز می گردانیم.

###### حال نوبت آن است که component مورد نظر ما یعنی UserCreateComponent را ویرایش کنیم. در ابتدا مواردی که نیاز است import را می نویسیم.

```bash
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';
```

###### به props خود مقدار refresh اضافه می کنیم که در اثز ساخت پست، بتوانیم جدول را مجدد به روز کنیم.

```bash
const props = defineProps({
  modal: {
    default: false,
  },
  refresh: {},
});
```

###### متغیر هایی که برای نمایش خطا های input ها نیاز است را می سازیم.
```bash
const titleError = ref('');
const descriptionError = ref('');
const imageError = ref('');

const titleState = ref(null);
const descriptionState = ref(null);
const imageState = ref(null);
```

###### برای اینکه بتوانیم طول و عرض جغرافیایی را دریافت کنیم و نگه داریم، متغیر createPostParameter را ویرایش می کنیم.

```bash
const createPostParameter = ref({
  title: '',
  description: '',
  image: undefined,
  latitude: <number>37.28,
  longitude: <number>49.6,
});
```

###### حال می رویم سراغ تابعی که وظیفه ارسال به سمت سرور را دارد. وقتی ما می پذیریم که داده های ما درست است، باید شروع کنیم به بررسی. اولین کار این است که ببینیم آیا مقادیر وضعیت هر ورودی متناسب با قوانین ما پر شده است یا نه، این کار را از طریق الگو زیر انجام می دهیم.

```bash
titleState.value.validate();
descriptionState.value.validate();
imageState.value.validate();
```

###### بعد از آن شرطی قرار می دهیم که اگر وضعیت های موجود، حتی یکی از آن ها هم دارای خطا بود، چاپ می کنیم که فرم را پر کند و اگر مشکلی نداشت اقدام به ارسال فرم کند. اگر جواب بازگشتی از سمت سرور بدون مشکل بود، dialog بسته شود و جدول به روز شود تا پست ما نمایش داده شود، اما اگر خطایی داشت، حتما خطا های آن نمایش دهد و بعد 5 ثانیه خطا ها را محو کند.

```bash
if (
  titleState.value.hasError ||
  descriptionState.value.hasError ||
  imageState.value.hasError
) {
  console.log('please Complete Form Data');
} else {
  Post.createPost(
    createPostParameter.value.title,
    createPostParameter.value.description,
    createPostParameter.value.image,
    createPostParameter.value.latitude,
    createPostParameter.value.longitude
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
          titleError.value =
            reject.response.data.errors?.title?.toString() ?? '';
          descriptionError.value =
            reject.response.data.errors?.description?.toString() ?? '';
          imageError.value =
            reject.response.data.errors?.image?.toString() ?? '';
          setTimeout(() => {
            titleError.value = '';
            descriptionError.value = '';
            imageError.value = '';
          }, 5000);
        }
      }
    }
  );
}
```
###### حال نوبت آن است که ما در template شروع به ویرایش کنیم. اول می رویم سراغ q-input ها. اول نوبت q-input مربوط به title است.

```bash
ref="titleState"
:error="titleError.length > 0"
:error-message="titleError"
```
###### مقادیر فوق را اضافه می کنیم که هر گاه خطایی وجو داشت، بلافاصله نمایش دهد. و دو مقدار زیر را وارد می کنیم به جهت اینکه قوانینی برای input بگذاریم.

```bash
:rules="[
  (val) => !!val || 'Required',
  (val) => val.length > 3 || 'Please use minimum 4 character',
  (val) => val.length <= 100 || 'Please use maximum 100 character',
]"
lazy-rules
```

###### برای rules ها می توانید از <a href="https://quasar.dev/vue-components/input#internal-validation">Quasar Input</a> کمک بگیرید و همچنین می توانید از لینک <a href="https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js">Github</a> انواع pattern های آماده را مشاهده کنید.

###### حال نوبت q-input مربوط به description است که همه این کار ها را برای آن انجام دهیم و قوانین مورد نظر را بر روی آن تنظیم کنیم.

```bash
ref="descriptionState"
:error="descriptionError.length > 0"
:error-message="descriptionError"
:rules="[
  (val) => !!val || 'Required',
  (val) => val.length > 3 || 'Please use minimum 4 character',
  (val) =>
    val.length <= 10000 || 'Please use maximum 10000 character',
]"
lazy-rules
```
###### همین کار را برای q-file می کنیم.
```bash
ref="imageState"
:error="imageError.length > 0"
:error-message="imageError"
:rules="[(val) => !!val || 'Required']"
lazy-rules
```
###### بعد q-file هم component نقشه ای که ساخته ایم را اجرا می کنیم.

```bash
<MapView
  v-model:latitude="createPostParameter.latitude"
  v-model:longitude="createPostParameter.longitude"
  :state="'move'"
></MapView>
```
###### حال باید در MyPostPage وارد شویم و component مربوط به UserCreatePost را ویرایش کنیم.

```bash
<UserCreatePost
  v-model:modal="createPostParameter.modal"
  :refresh="onRequest"
></UserCreatePost>
```

###### حال می توانید quasar dev را اجرا کنید و از افزودن پستی که ساخته اید، لذت ببرید.




