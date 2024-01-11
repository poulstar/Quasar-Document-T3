# پیاده سازی ویرایش پست خود و اجرا API آن همراه با Input Validation


###### برای آنکه ما بخواهیم هر پست را ویرایش کنیم، باید ابتدا تابع درخواست دهنده به سمت سرور را از الگو سرور بسازیم و آماده داشته باشیم.

```bash
static async updatePost(
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
    `api/update-my-post/${id}`,
    data
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Updated Failed');
}
```
###### وقتی کسی تابع ویرایش پست را زد، داده های مورد نظر را دریافت می کنیم و به سرور ارجاع می دهیم و سپس نتیجه آن  را به کسی که تابع را صدا زده، باز می گردانیم. مرحله بعدی می رویم سراغ فایل UserUpdatePost که  component ما بوده است. از بخش script آن شروع می کنیم. ابتدا مواردی که نیاز داریم import شود را اضافه می کنیم.

```bash
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';
```
###### در مرحله بعد به سراغ props می رویم و refresh را به آن اضافه می کنیم.

```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```

###### حال نوبت آن است که متغیر های مورد نیاز جهت نمایش خطا را بنویسیم تا بعد از آن استفاده کنیم.

```bash
const titleError = ref('');
const descriptionError = ref('');
const imageError = ref('');

const titleState = ref(null);
const descriptionState = ref(null);
const imageState = ref(null);
```

###### متغیر updatePostParameter ما نیاز به ویرایش دارد تا به آخرین حالت برسد و همه داده ها را در خود ذخیره کند.

```bash
const updatePostParameter = ref({
  id: 0,
  title: '',
  description: '',
  image: undefined,
  latitude: <number> 37.28,
  longitude: <number> 49.6,
});
```
###### تابع watch را به روز می کنیم تا به موقع هر گونه تغییر علاوه بر مقادیر گذشته، id و latitude و longitude را هم ویرایش کند.

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
###### حال نوبت به تابع accepted می رسد که باید اول نسبت به q-input هایی که برایشان قوانین گذاشته ایم چک شود، پس قطعه کد زیر را اول می نویسیم.

```bash
titleState.value.validate();
descriptionState.value.validate();
```
###### بعد به سراغ این می رویم که اگر قوانین ما رعایت نشده بود، چاپ کنیم که فرم را کامل کن و اگر موردی یافت نشد، درخواست ویرایش کنیم که موفق بود جدول ویرایش شود و اگر نه خطا مربوطه نمایش داده شود.

```bash
if (titleState.value.hasError || descriptionState.value.hasError) {
    console.log('please Complete Form Data');
} else {
  Post.updatePost(
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

###### حال نوبت آن است که برای بخش template اصلاحاتی را اعمال کنیم. برای ورودی های داده، قوانین مورد نظر خود را می گذاریم.

###### برای q-input مربوط به title قطعه کد زیر را می افزاییم.
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
###### برای q-input مربوط به description قطعه کد زیر را می افزاییم.
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
###### برای q-file مربوط به image قطعه کد زیر را می افزاییم.
```bash
ref="imageState"
:error="imageError.length > 0"
:error-message="imageError"
```
###### بعد از q-file برای نمایش نقشه، قطعه کد زیر را می افزاییم.
```bash
<MapView
  v-model:latitude="updatePostParameter.latitude"
  v-model:longitude="updatePostParameter.longitude"
  :state="'move'"
></MapView>
```
###### حال نوبت آن رسیده تا کمی MyPostPage را ویرایش کنیم. در بخش script به سراغ updatePostParameter می رویم و تغییرات زیر را روی آن اعمال می کنیم.

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
###### تابع updatePost را هم ویرایش می کنیم و به صورت زیر می نویسیم.
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
###### حال نیاز است به سراغ component ویرایش پست یعنی UserUpdatePost برویم و تغییرات زیر را روی آن اعمال کنیم.

```bash
<UserUpdatePost
  v-model:modal="updatePostParameter.modal"
  v-model:data="updatePostParameter"
  :refresh="onRequest"
></UserUpdatePost>
```
###### کلیه کار های مورد نیاز ما برای ویرایش پست های که ساخته ایم انجام شده، حال می توانید از آن استفاده نمایید.



