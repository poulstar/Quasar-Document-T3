# دریافت پست ها بر اساس like ها و نمایش آنها به صورت کارت در صفحه اصلی داشبورد


###### برای اینکه بخواهیم تمام پست ها را در صفحه اول خود نشان دهیم، لازم است تا تابع آن را در مدل Post بنویسیم، از آنجایی که مقدار پست دارای تصویر است، برای مدل خود یک property تعریف می کنیم.
###### ابتدا در خطر اول مدل Post متغیر خود را به صورت زیر می نویسیم.
```bash
public static serverRoute = 'https://openapi.poulstar.org/';
```
###### اگر شما متغیر خود را در مدل به این صورت بنویسید، می توانید آن را در هر جا صدا کنید و از آن استفاده کنید.

###### حال تابع static خود را به صورت زیر پیاده سازی می کنیم، متناسب با الگویی که سرور به ما می گوید.
```bash
static async allPostInDashboard(page: number, per_page: number) {
  const response = await api.get<FetchResponse<Post>>(
    `api/all-posts-for-dashboard?page=${page}&per_page=${per_page}`
  );
  if (response.status == 200) {
    const posts: any = [];

    response.data.posts.data.forEach((post) => {
      posts.push({
        id: post.id,
        image: this.serverRoute + post.media[0].url,
        latitude: post.latitude,
        longitude: post.longitude,
        title: post.title,
        username: post.user.name,
        description: post.description,
        upVoteCount: post.up_vote_count,
      });
    });
    return {
      posts: posts,
    };
  }
  throw Error('Request Failed');
}
```
###### وقتی درخواست خود را ارسال می کنیم، داده ها را گرفته و به شکل یک آرایه با توجه به نیاز خود در می آوریم و ذخیره می کنیم و به کسی که این تابع را صدا کرده، باز می گردانیم.

###### حال نوبت آن است که ما به سراغ IndexComponent برویم و درخواست کردن جهت گرفتن تمام پست ها را در آن بنویسیم.
###### ابتدا مدل Post را import می کنیم تا بتوانیم از آن استفاده کنیم.
```bash
import { Post } from 'src/models/post';
```
###### در این گام متغیر posts را خالی می کنیم و آماده داده های سرور می کنیم. بعد تابع refresh را می سازیم تا به سمت سرور درخواست بزنیم و درخواست را برای صفحه اول و 1000 پست می فرستیم تا بعد وقتی صفحه بندی را اعمال کردیم آن را ویرایش کنیم.
```bash
const posts = ref();
const refresh = () => {
  Post.allPostInDashboard(1,1000)
  .then(
    (response)=>{
      posts.value = response.posts;
    }
  )
};
```
###### مرحله آخر export خود را ویرایش می کنیم و refresh را به آن اضافه می کنیم.
```bash
export {posts, refresh}
```
###### حال نوبت آن رسیده است که شروع به تغییر IndexPage کنیم. طبق معمول باز از script شروع می کنیم و مواردی که نیاز داریم را import می کنیم. دقت کنید اول import های مربوط به IndexComponent را ویرایش می کنیم.
```bash
import { posts, refresh } from 'components/ts/IndexComponent';
```
###### برای استفاده از  ref  و نقشه هم موارد زیر را import می کنیم.
```bash
import { ref } from 'vue';
import MapView from 'components/vue/MapView.vue';
```
###### برای اینکه وقتی این صفحه را صدا کردیم، هر بار بروز شود، تابع refresh را در آن می نویسیم.
```bash
refresh();
```
###### برای اینکه مکان هر پست را نمایش دهیم و این کار را با استفاده از الگو dialog تمام صفحه انجام دهیم. متغیر و تابع زیر را می نویسیم.
```bash
const mapParameter = ref({
  lat: <number>0,
  long: <number>0,
  maximize: <boolean>false,
});

const fullMap = (lat: number, long: number) => {
  mapParameter.value.lat = lat;
  mapParameter.value.long = long;
  mapParameter.value.maximize = true;
};
```
###### حال می رویم سراغ template  و مواردی که لازم است برای ویرایش آن انجام دهیم.
###### اول q-btn ای که داخل q-card است و نماد مکان جغرافیایی روی آن است را مجهز @click می کنیم تا وقتی روی آن کلیک شد، نقشه ما باز شود و مکانی که در آن پست ثبت شده است را به ما نشان دهد.
```bash
@click="fullMap(post.latitude, post.longitude)"
```
###### بعد از q-layout فضای مورد نیاز جهت نوشتن dialog ما هست، می توانیم قطعه کد زیر را داخل آن بنویسیم و نقشه را داخل آن اجرا کنیم.
```bash
<q-dialog
  v-model="mapParameter.maximize"
  persistent
  :maximized="mapParameter.maximize"
>
  <q-card class="bg-primary text-white">
    <q-bar>
      <q-space />
      <q-btn dense flat icon="close" v-close-popup></q-btn>
    </q-bar>
    <MapView
      class="full-width full-height"
      :latitude="mapParameter.lat"
      :longitude="mapParameter.long"
    ></MapView>
  </q-card>
</q-dialog>
```


