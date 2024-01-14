# اجرا Pagination و بر روی پست های صفحه اصلی داشبورد


###### برای اجرای pagination می توانید بخش <a href="https://quasar.dev/vue-components/pagination/">Quasar Pagination</a> را مطالعه کنید. برای اینکه بتوانیم صفحه بندی را روی صفحه اصلی داشبورد فعال کنیم، باید ابتدا داده های دریافتی در مدل Post را ویرایش کنیم
```bash
return {
  posts: posts,
  page_data: {
    current_page: response.data.posts.current_page,
    last_page: response.data.posts.last_page
  },
};
```
###### در return موجود در allPostInDashboard مقادیر صفحه جاری و آخرین صفحه را دریافت کرده به صدا زننده تابع باز می گردانیم.

###### حال لازم است در IndexComponent متغیر های صفحه بندی را بنویسیم و تابع refresh را به روز کنیم.

###### در متغیر pagination سه پارامتر را که نیاز داریم می سازیم، صفحه جاری و آخرین صفحه و تعداد در هر صفحه.
```bash
const pagination = ref({
  current_page: 1,
  last_page: 4,
  per_page: 4,
});
```
###### حال نوبت آن رسیده است که تابع refresh را به روز کنیم.
```bash
const refresh = () => {
  Post.allPostInDashboard(
    pagination.value.current_page,
    pagination.value.per_page
  ).then((response) => {
    posts.value = response.posts;
    pagination.value.current_page = response.page_data.current_page;
    pagination.value.last_page = response.page_data.last_page;
  });
};
```
###### برای درخواست پارامتر ها را می گذاریم از روی صفحه جاری بخواند و برای تعداد پست ها در  هر صفحه نیز از per_page موجود در pagination. وقتی جواب از سمت سرور بازگشت، عدد صفحه جاری و آخرین صفحه pagination را ویرایش می کنیم.

###### حال لازم است export خود را ویرایش کنیم.
```bash
export { posts, refresh, pagination };
```

###### وارد IndexPage می شویم و بخش import مربوط به IndexComponent را ویرایش می کنیم.
```bash
import { posts, refresh, pagination } from 'components/ts/IndexComponent';
```
###### بعد q-card تگ pagination را می نویسیم و مقادیر زیر را به آن می دهیم.
```bash
<div class="q-gutter-md q-pa-lg">
  <q-pagination
    class="d-flex justify-center"
    v-model="pagination.current_page"
    :max="pagination.last_page"
    direction-links
    push
    color="primary"
    active-design="push"
    active-color="orange"
    :max-pages="7"
    @update:model-value="refresh"
  />
</div>
```
###### به div کلاس می دهیم تا فاصله بگیرد و روی pagination مواردی که می خواهیم را می دهیم. کلاس می دهیم تا در وسط صفحه قرار گیرد، v-model را برابر با صفحه جاری می گذاریم، max را برابر با مقدار آخرین صفحه pagination قرار می دهیم. direction-links می گذاریم تا بشود با زدن فلش های چپ و راست یک صفحه به جلو یا عقب رفت. push را می گذاریم تا برای هر عدد یک background به صورت باکس یه وجود آید. رنگ را با color مشخص کردیم. با active-design می توانیم نوع صفحه جاری را مشخص کنیم و با active-color می توانیم رنگ شماره صفحه را متمایز کنیم. برای تعیین تعداد آیتم هایی که شماره صفحات را نشان دهد با max-pages مشخص می شود و برای هر گونه تغییر، تابع refresh را به @update:model-value می دهیم.


