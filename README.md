# پیاده سازی حذف پست های خود با استفاده از API و بروز رسانی لیست پست ها


###### برای اینکه مکانیزم حذف یک پست را پیاده سازی کنیم، ابتدا به مدل Post می رویم و تابع static آن را می نویسیم.

```bash
static async deletePost(id: number) {
  const response = await api.get<FetchResponse<Post>>(
    `api/delete-my-post/${id}`
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Deleted Failed');
}
```
###### باز هم مثل همیشه سعی می کنیم مطابق الگویی که سرور گفته، درخواست خود را بسازیم و منتظر جواب مانده و نتیجه را بازتاب  دهیم.

###### در مرحله بعد به سراغ component مورد نظر یعنی UserDeletePost می رویم و اقدامات مورد نظر را روی آن اعمال می کنیم. از بخش script شروع می کنیم و مرحله به مرحله به جلو می رویم. اولین کاری که لازم است انجام دهیم، بحث import کردن مواردی است که نیاز داریم.

```bash
import { Post } from 'src/models/post';
import MapView from 'components/vue/MapView.vue';
```
###### مرحله بعد افزودن refresh به props ما است.
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```
###### حال قصد این داریم که فرآیند ارسال و دریافت را به کاربر نمایش دهیم، از همین رو در بخش template از <a href="https://quasar.dev/vue-components/banner">Quasar Banner</a> استفاده می کنیم. اما قبل آن متغیر هایی که نیاز داریم را می سازیم و از آن ها استفاده می کنیم.

```bash
const preSendingMessage = ref(false);
const doneMessage = ref(false);
const doneMessageText = ref('');
const errorMessage = ref(false);
const errorMessageText = ref('');
```
###### تابع close را ویرایش می کنیم و قبل بسته شدن همه حالت ها را به صورت اولیه در می آوریم.
```bash
const close = () => {
  preSendingMessage.value = false;
  doneMessage.value = false;
  doneMessageText.value = '';
  errorMessage.value = false;
  errorMessageText.value = '';
  emit.call(this, 'update:modal', false);
};
```
###### نوبت بعدی برای تابع accepted است. در هنگام شروع تابع، متن در حال ارسال را فعال می کنیم که نمایش دهد. به محض اینکه موفق بود یا با شکست مواجه شد، ما نمایش آن را لغو می کنیم. اگر موفق بود در این حالت جدول را بروز می کنیم و بعد متن موفقیت را نمایش می دهیم و بعد از 3 ثانیه متن موفقیت را از نمایش در می آوریم و dialog را می بندیم. همین کار در حالت خطا انجام می شود یا این تفاوت که مدت زمان جهت بسته شدن 5 ثانیه است و نوار هشدار ما باز می شود. دقت کنید در حالت موفقیت و شکست برای پر کردن متن خطا ما errors.error[0] استفاده کرده ایم. به دلیل ساختار سرور و نوع object ارسالی، ما این کار را کردیم.
```bash
const accepted = () => {
  preSendingMessage.value = true;
  Post.deletePost(props.data.id).then(
    (response) => {
      if (response.status == 200) {
        preSendingMessage.value = false;
        props.refresh();
        if (response.data.errors) {
          doneMessage.value = true;
          doneMessageText.value = response.data.errors.error[0];
          setTimeout(() => {
            doneMessage.value = false;
            emit.call(this, 'update:modal', false);
          }, 3000);
        }
      }
    },
    (reject) => {
      if (reject.response.status != 200) {
        if (reject.response.data.errors) {
          preSendingMessage.value = false;
          errorMessage.value = true;
          errorMessageText.value = reject.response.data.errors.error[0];
          setTimeout(() => {
            errorMessage.value = false;
          }, 5000);
        }
      }
    }
  );
};
```
###### حال نوبت آن رسیده است که وارد template شویم.  در تگ q-card برای هر سه وضعیت خود از یعنی هشدار، و موفقیت و شکست از q-banner استفاده می کنیم. برای اینکه نمایش دهد یا نه بر روی آن ها v-show قرار داده ایم برای نوع رنگ هر کدام هم از متغیر های سراسری در فایل quasar.variables.scss استفاده نموده ایم. برای حالت هشدار متن ثابت و برای حالت های دیگر  متن دریافت شده از سرور را نمایش می دهیم.

```bash
<q-banner
  inline-actions
  rounded
  class="bg-warning text-white"
  v-show="preSendingMessage"
>
  Your request is being sent
</q-banner>
<q-banner
  inline-actions
  rounded
  class="bg-positive text-white"
  v-show="doneMessage"
>
  {{ doneMessageText }}
</q-banner>
<q-banner
  inline-actions
  rounded
  class="bg-negative text-white"
  v-show="errorMessage"
>
  {{ errorMessageText }}
</q-banner>
```
###### حال در بخشی که نقشه قرار بود نمایش داده شود، یعنی q-tab-panel، جهت نمایش component نقشه خود را در آن می نویسیم.
```bash
<q-tab-panel name="map">
  <MapView
    :latitude="props.data.latitude"
    :longitude="props.data.longitude"
  ></MapView>
</q-tab-panel>
```

###### حال نوبت آن رسیده است که وارد MyPostPage شویم و اصلاحات مورد نظر خود را اعمال کنیم. در بخش script ابتدا متغیر deletePostParameter را ویرایش می کنیم.

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
###### بعد می رویم سراغ تابع deletePost و آن را هم ویرایش می کنیم.
```bash
const deletePost = (row: any) => {
  deletePostParameter.value.id = row.id;
  deletePostParameter.value.image = serverRoute + row.media[0].url;
  deletePostParameter.value.title = row.title;
  deletePostParameter.value.username = profileTemp.value.username;
  deletePostParameter.value.description = row.description;
  deletePostParameter.value.latitude = row.latitude;
  deletePostParameter.value.longitude = row.longitude;
  deletePostParameter.value.modal = !deletePostParameter.value.modal;
};
```
###### و سر آخر نوبت آن است که component خود را یعنی UserDeletePost نیز ویرایش شود.
```bash
<UserDeletePost
  v-model:modal="deletePostParameter.modal"
  v-model:data="deletePostParameter"
  :refresh="onRequest"
></UserDeletePost>
```
##### اکنون تمام کار های لازم جهت انجام حذف پست خود انجام شده و می توانید از آن استفاده کنید.
