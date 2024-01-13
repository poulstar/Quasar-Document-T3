# پیاده سازی حذف کل پست ها برای admin با استفاده از API و بروز رسانی لیست پست ها


###### اول شروع به نوشتن تابع static در مدل post می کنیم. تابع را مطابق الگو سرور می نویسیم و نتیجه را متقابلا برگشت می دهیم.
```bash
static async adminDeletePost(id: number) {
  const response = await api.get<FetchResponse<Post>>(
    `api/delete-post-by-admin/${id}`
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Delete Failed');
}
```
###### حال نوبت آن است که component را کامل کنیم. ابتدا از بخش script شروع می کنیم. کار اول ما این است که import های مورد نیاز خود را بنویسیم.
```bash
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';
```
###### سپس نیاز داریم refresh را به props آن اضافه کنیم.
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```
###### بعد از آن تابع  accepted را آماده می کنیم تا به موقع صدا زدن آن، دستور پاک کردن پست ارسال شود.

```bash
const accepted = () => {
  Post.adminDeletePost(props.data.id).then(
    (response) => {
      if (response.status == 200) {
        props.refresh();
        emit.call(this, 'update:modal', false);
      }
    },
    (reject) => {
      if (reject.response.status != 200) {
        if (reject.response.data.errors) {
          console.log(reject.response.data.errors.error[0]);
        }
      }
    }
  );
};
```
###### بعد آنکه درخواست زده شد، پست را پاک می کنیم، اگر بعد درخواست مشکلی در انجام کار پیش آمد، خطا مربوطه را چاپ می کنیم.
###### حال نوبت آن رسیده که وارد template شویم. برای اینکه جهت نمایش، نقشه وجود داشته باشد، component نقشه را اضافه می کنیم.

```bash
<q-tab-panel name="map">
  <MapView
    :latitude="props.data.latitude"
    :longitude="props.data.longitude"
  ></MapView>
</q-tab-panel>
```
###### بعد از این مرحله نوبت آن است که وارد AllPostPage شویم. در این صفحه اول سراغ script می رویم تا متغیر ها و تابع های مورد نظر خود را ویرایش کنیم، سپس برای template اقدام کنیم.
###### ابتدا متغیر deletePostParameter را ویرایش می کنیم و طول و عرض جغرافیایی را به آن اضافه می کنیم.
```bash
const deletePostParameter = ref({
  modal: <boolean>false,
  id: <number>0,
  image: <string>'',
  title: <string>'',
  username: <string>'',
  description: <string>'',
  latitude: <number>37.28,
  longitude: <number>49.6,
});
```
###### تابع  deletePost را هم بروز رسانی می کنیم تا به موقع فشردن دکمه حذف، کلی داده های این پست به سمت component رود.
```bash
const deletePost = (row: any) => {
  deletePostParameter.value.id = row.id;
  deletePostParameter.value.image = serverRoute + row.media[0].url;
  deletePostParameter.value.title = row.title;
  deletePostParameter.value.username = row.user.name;
  deletePostParameter.value.description = row.description;
  deletePostParameter.value.latitude = row.latitude;
  deletePostParameter.value.longitude = row.longitude;
  deletePostParameter.value.modal = !deletePostParameter.value.modal;
};
```
###### حال نوبت آن رسیده که را AdminDeletePost ویرایش کنیم.
```bash
<AdminDeletePost
  v-model:modal="deletePostParameter.modal"
  v-model:data="deletePostParameter"
  :refresh="onRequest"
></AdminDeletePost>
```


###### حال نوبت آن رسیده است که quasar dev انجام دهیم و از نرم افزار خود لذت ببریم.

