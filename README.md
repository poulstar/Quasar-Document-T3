# پیاده سازی ویرایش کل پست ها برای admin و اجرا API آن همراه با Input Validation


###### برای اینکه بخش مدیریت سایت بتواند هر پستی را ویرایش کند، ابتدا در مدل  post تابع درخواست دهنده به سرور را متناسب با الگو خود سرور می سازیم.

```bash
static async adminUpdatePost(
  id: number,
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
  const response = await api.post<AxiosResponse>(
    `api/update-post-by-admin/${id}`,
    data
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Update Failed');
}
```
###### کلیه داده های مورد نظر به سمت سرور ارسال خواهد  و پست مورد نظر برای هر کاربری باشد ویرایش می شود.

###### در مرحله بعدی قطعا ما نیاز داریم به سراغ AdminUpdatePost برویم و آن را برای ارسال و انجام فرآیند بروز رسانی پست آماده کنیم. از بخش script شروع می کنیم.

###### مواردی که برای نیاز داریم را به صورت زیر import می کنیم.
```bash
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';
```
###### مرحله بعد نوبت افزودن refresh به props است
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```

###### برای اینکه خطا های هر input را نمایش دهیم، متغیر های  زیر را می نویسیم.
```bash
const titleError = ref('');
const descriptionError = ref('');
const imageError = ref('');

const titleState = ref(null);
const descriptionState = ref(null);
const imageState = ref(null);
```

###### برای نگه داری داده ها به صورت موقت و ارسال آن ها به سمت سرور، updatePostParameter را ویرایش می کنیم.
```bash
const updatePostParameter = ref({
  id: 0,
  title: '',
  description: '',
  image: undefined,
  latitude: <number>37.28,
  longitude: <number>49.6,
});
```
###### حال نوبت آن رسیده است که برای watch هم تغییرات را لحاظ کنیم و مواردی که اضافه کرده ایم، به آن هم اضافه کنیم.
```bash
watch(props, () => {
  updatePostParameter.value = {
    id: props.data.id,
    title: props.data.title,
    description: props.data.description,
    image: updatePostParameter.value.image,
    latitude: props.data.latitude,
    longitude: props.data.longitude,
  };
});
```

###### در تابع accepted اول بررسی می کنیم که آیا قوانین ما اجرا شده است یا خیر. به همین منظور، بررسی input های مربوط به title و description را اجرا می کنیم.

```bash
titleState.value.validate();
descriptionState.value.validate();
```
###### گام بعدی نوبت این است که ببینیم آیا ورودی های ما دارای خطا هستند یا خیر، اگر مشکلی نداشتند اقدام به درخواست به سمت سرور کنیم. در غیر این صورت هشدار دهیم که فرم خود را پر کنید.
```bash
if (titleState.value.hasError || descriptionState.value.hasError) {
    console.log('please Complete Form Data');
} else {
  Post.adminUpdatePost(
    updatePostParameter.value.id,
    updatePostParameter.value.title,
    updatePostParameter.value.description,
    updatePostParameter.value.image,
    updatePostParameter.value.latitude,
    updatePostParameter.value.longitude
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
###### مرحله بعدی نوبت template است و باید قوانین خود را بر روی ورودی های داده بگذاریم.

###### برای q-input مربوط به title موارد زیر را اضافه  می کنیم.
```bash
ref="titleState"
:error="titleError.length > 0"
:error-message="titleError"
:rules="[
  (val) => !!val || 'Required',
  (val) => val.length > 3 || 'Please use minimum 4 character',
  (val) => val.length <= 100 || 'Please use maximum 100 character',
]"
lazy-rules
```
###### برای q-input مربوط به description موارد زیر را اضافه  می کنیم.
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
###### برای q-file مربوط به image موارد زیر را اضافه  می کنیم.
```bash
ref="imageState"
:error="imageError.length > 0"
:error-message="imageError"
```
###### و در انتها بعد از q-file نیاز داریم نقشه ما به نمایش در آید. از همین رو component نقشه را به صورت زیر می نویسیم.
```bash
<MapView
  v-model:latitude="updatePostParameter.latitude"
  v-model:longitude="updatePostParameter.longitude"
  :state="'move'"
></MapView>
```

###### حال نوبت آن رسیده است که متغیر  updatePostParameter را ویرایش کنیم و مواردی که مورد نیاز است را به آن بی افزاییم.
```bash
const updatePostParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  title: <string>'',
  description: <string>'',
  latitude: <number>37.28,
  longitude: <number>49.6,
});
```

###### حال نوبت آن رسیده که تابع updatePost را ویرایش کنیم.
```bash
const updatePost = (row: any) => {
  updatePostParameter.value.id = row.id;
  updatePostParameter.value.title = row.title;
  updatePostParameter.value.description = row.description;
  updatePostParameter.value.latitude = row.latitude;
  updatePostParameter.value.longitude = row.longitude;
  updatePostParameter.value.modal = !updatePostParameter.value.modal;
};
```
###### بعد آن نوبت ویرایش component مورد نظر ما یعنی AdminUpdatePost است.
```bash
<AdminUpdatePost
  v-model:modal="updatePostParameter.modal"
  v-model:data="updatePostParameter"
  :refresh="onRequest"
></AdminUpdatePost>
```

###### حال که همه موارد جهت اجرا  ویرایش پست بخش مدیر سایت انجام شده است، می توانید از آن استفاده کنید.


