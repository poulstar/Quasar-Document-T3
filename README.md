# نمایش سه پست برتر همراه با مکان جغرافیایی آن و آموزش v-slot و carousel و Directive


###### برای آنکه بخواهیم سه پست برتر را نمایش دهیم، ابتدا لازم است مجدد به تابع allPostInDashboard رجوع کنیم و مقدار top_post را که برای ما از سمت سرور می آید را سازمان دهی کنیم.

###### ابتدا متغیر top_post را می سازیم.
```bash
const top_post: any = [];
```
###### حال نوبت آن است که داده های را وا کاوی  کنیم و به الگو مورد نیاز خود برسیم.
```bash
response.data.topPosts.forEach((post:any) => {
  top_post.push({
    id: post.id,
    image: this.serverRoute + post.media[0].url,
    title: post.title,
    description: post.description,
    latitude: post.latitude,
    longitude: post.longitude,
    username: post.user.name,
    email: post.user.email,
  });
});
```
###### در گام بعدی return را ویرایش می کنیم.
```bash
return {
  posts: posts,
  page_data: {
    current_page: response.data.posts.current_page,
    last_page: response.data.posts.last_page
  },
  top_post: top_post,
};
```

###### حال نوبت IndexComponent است. وارد component می شویم و متغیر top_posts را می سازیم و در refresh قرار می دهیم.
```bash
const top_posts = ref();
```
###### حال تابع refresh را هم بروز می کنیم.
```bash
const refresh = () => {
  Post.allPostInDashboard(
    pagination.value.current_page,
    pagination.value.per_page
  ).then((response) => {
    posts.value = response.posts;
    pagination.value.current_page = response.page_data.current_page;
    pagination.value.last_page = response.page_data.last_page;
    top_posts.value = response.top_post;
  });
};
```
###### گام بعدی بروز کردن export است.
```bash
export { posts, refresh, pagination, top_posts };
```
###### برای اینکه بتوانیم بر روی نقشه متنی ظاهر کنیم، باید برای نقشه خود v-slot بسازیم
###### در component نقشه خود جایی که template است، داخل div نقشه، دو div می سازیم. یکی برای نمایش نام کاربری و دیگری برای نمایش پست الکترونیک کاربر. موقع استفاده نامی که به slot داده ایم را بکار می بریم.
```bash
<div ref="mapRef" class="map">
  <div class="username">
    <slot name="username"></slot>
  </div>
  <div class="email">
    <slot name="email"></slot>
  </div>
</div>
```
###### برای نمایش مطلوب خود، دو کلاس را به صورت زیر در تگ style می نویسیم.
```bash
.username {
  position: absolute;
  bottom: 10px;
  left: 25px;
  z-index: 10;
  color: gray;
  font-size: 20px;
}
.email {
  position: absolute;
  left: 25px;
  top: 10px;
  z-index: 10;
  color: gray;
  font-size: 20px;
}
```
###### حال نوبت آن است که وارد IndexPage شویم و شروع کنیم به نوشتن مواردی که می خواهیم. ابتدا import های IndexComponent را بروز می کنیم.
```bash
import {
  posts,
  refresh,
  pagination,
  top_posts,
} from 'components/ts/IndexComponent';
```
###### برای استفاده از carousel باید یک متغیر تعریف کنیم و شماره شروع صفحه جاری را در آن نگه داریم.
```bash
const slide = ref(1);
```
###### موقتا به template می رویم و carousel را پیاده سازی می کنیم. اگر بخواهیم دقیق تر در مورد carousel بدانیم، می توانیم <a href="https://quasar.dev/vue-components/carousel/">Quasar Carousel</a> را مطالعه کنیم. حال ما بالای پست ها و در داخل q-layout قطعه کد زیر را می نویسیم.
```bash
<div class="q-pa-sm">
  <q-carousel
    v-model="slide"
    control-color="amber"
    navigation
    padding
    arrows
    height="300px"
    class="rounded-borders bg-transparent"
  >
    <q-carousel-slide
      v-for="(item, index) in top_posts"
      :key="index"
      :name="index + 1"
      class="column no-wrap"
    >
      <div
        class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
      >
        <div class="rounded-borders col-6 full-height">
          <MapView
            class="full-width full-height"
            :latitude="item.latitude"
            :longitude="item.longitude"
          >
            <template v-slot:username>
              <div>
                {{ item.username }}
              </div>
            </template>
            <template v-slot:email>
              <div>
                {{ item.email }}
              </div>
            </template>
          </MapView>
        </div>
        <div class="rounded-borders col-6 full-height">
          <div class="full-width full-height relative-position">
            <q-img
              :src="item.image"
              class="full-width full-height detail"
            />
            <div class="cover"></div>
            <div class="overlay">
              <p class="overlay-title">{{ item.title }}</p>
              <p class="overlay-owner">{{ item.username }}</p>
              <p class="overlay-text">
                {{ item.description.substring(0, 100) }} ...
              </p>
            </div>
          </div>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</div>
```
###### با نوشتن q-carousel ما می توانیم یک slide show داشته باشیم. حال props های آن را به صورت فوق نوشتیم. مقدار v-model آن را برابر با متغیر slide خود قرار دادیم و رنگ control آن را تعیین نمودیم برای navigation که بتوان تعداد صفحات را متوجه شد و بین آن ها انتخاب کرد. padding انتخاب کردیم که محتوا carousel بر روی navigation قرار نگیرد و با استفاده از کلاس و height وضعیت ظاهری آن را هم مشخص کردیم.

###### در q-carousel برای اینکه بتوانید صفحات را بسازید باید از q-carousel-slide استفاده کنید، به همین دلیل ما رو آن حلقه قرار دادیم برای روی لیست top_posts. دقت کنید که نام q-carousel-slide همان شماره اسلاید است. یک div می سازیم و در آن دو بخش چپ و راست به وجود می آوریم، سمت چپ برای نقشه و سمت راست برای پست.

###### در سمت چپ وقتی نقشه را اجرا می کنیم، در بین تگ MapView با ساخت تگ template، می خواهیم مشخص کنیم محتوا داخل آن متعلق است به slot مورد نظر ما. و این کار را با قرار دادن نام آن slot در v-slot تگ template انجام می دهیم.

###### در بخش سمت راست هم یک باکس درست می کنیم که عکس به صورت کامل نمایش داده می شود، یه کاوری به صورت مشکی  مات روی آن قرار می گیرد و متن بر روی عکس جزئیات را می رساند. برای این کار کمی کلاس نوشتیم که آن را در app.scss تعریف می نماییم.


```bash
.cover {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 1;
}
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
  align-items: flex-start;
}
.overlay-title {
  font-size: 24px;
  font-weight: 1000;
  color: white;
  padding: 30px 20px 0;
}
.overlay-owner {
  font-size: 12px;
  color: white;
  padding: 0px 20px 0;
}
.overlay-text {
  font-size: 14px;
  color: white;
  padding: 0 20px 10px;
  text-align: justify;
}
```
###### حال نوبت آن است که directive بسازیم و از آن استفاده کنیم، به v-model، v-if، v-for و ... directive می گویند و ما می خواهیم directive خودمان را بسازیم. از همین رو ابتدا به script می رویم و directive خود را می سازیم و بعد در template از آن استفاده می کنیم.
###### در script به صورت زیر می نویسیم.
```bash
const vLocation = {
  beforeMount(el, binding) {
    el.innerText = parseFloat(binding.value).toFixed(2);
  },
  updated(el, binding) {
    el.innerText = parseFloat(binding.value).toFixed(2);
  },
};
```
###### نام آن را vLocation گذاشتیم، یعنی directive ساختیم به نام v-location. حال در آن با استفاده از تابع beforeMount قبل آن که به نمایش در بی آید، دستور داده ایم در داخل tag عدد اعشاری را تا دو رقم اعشار نمایش دهد. در تابع updated هم دستور دادیم در صورت ویرایش شدن پست نیز آن بلافاصله تغییر کند. در هر دو تابع، el در واقع همان تگ است که این directive را روی آن می نویسیم و binding در واقع مقداری است که به آن نسبت می دهیم. برای مطالعه بیشتر در مورد ساخت directive ها می توانید <a href="https://vuejs.org/guide/reusability/custom-directives">Vue Custom Directives</a> را مطالعه کنید.
###### حال نوبت آن است که از directive خود استفاده کنیم. به سراغ کارت ها پست خود در template می رویم و بعد تمام شدن پارت title، قبل اینکه q-card-section بسته شود، قطعه کد زیر را می نویسیم.
```bash
Lat: <span class="text-info" v-location="post.latitude"></span>
Long: <span class="text-info q-ma-xs" v-location="post.longitude"></span>
```

###### حال بر روی هر پست طول و عرض جغرافیایی با دو رقم اعشار به نمایش در می آید.


