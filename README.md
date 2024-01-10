# دریافت و نمایش پست های من با استفاده از API همراه با قابلیت فیلتر کردن داده ها و همچنین Pagination

###### برای اینکه بتوانیم صفحه پست های خود را کامل کنیم. لازم است مار های زیر را انجام دهیم. اول برای اینکه داده هایی که از سمت سرور می آید برایش یک الگو تایپ داشته باشیم، در پوشه models یک فایل types از نوع ts می سازیم و قطعه کد زیر را تعریف می کنیم.

```bash
export class FetchResponse<model> {
  meta?: {
    pagination?: {
      [key: string]: {
        per_page?: number;
        total?: number;
        first_item?: number;
        last_item?: number;
        last_page?: number;
        current_page?: number;
      };
    };
  };
  [key: string]: Array<model>;
}
```
###### یک کلاس FetchResponse می سازیم که می تواند مدل های مختلف را در خود بپذیرد. از سمت سرور object به سوی ما می آید به نام meta که اگر وجود داشت به صورت زیر آن را تحویل می گیریم. در این meta برای ما اطلاعاتی ممکن است ارسال شود با عنوان pagination که یک الگو ثابت دارد. اول اینکه عنوان کلید آن از نوع string است و می تواند هر چیزی باشد. مثلا post یا user باشد که اشاره کند داده های زیر اطلاعات صفحه بندی آن است. در داخل آن که همه از نوع number است. در اطلاعاتی که ارسال می شود، در هر صفحه چند ردیف داده هست و کل داده ها و اولین داده و آخرین داده و آخرین صفحه و صفحه جاری برای ما ارسال می شود. در انتها تعیین کردیم که می تواند اطلاعات دیگری نیز همراه آن باشد که کلیدش از نوع رشته است و داده های آن از نوع آرایه است.


###### حال نوبت آن رسیده که برای مدیریت پست ها خود در پوشه models یه فایل از نوع ts به نام post نیز درست کنیم و به صورت زیر در آن مدل Post را تعریف کنیم.

```bash
import { api } from 'src/boot/axios';
import { FetchResponse } from 'src/models/types';
export class Post {
  static async myPosts(page: number, filter: string) {
    const response = await api.get<FetchResponse<Post>>(
      `api/my-posts?page=${page}&filter=${filter ?? ''}`
    );
    if (response.status == 200) {
      return response;
    }
    throw Error('My Posts failed');
  }
}
```
###### در شروع مثل مدل User برای خود api را import می کنیم. اما برای اینکه می خواهیم داده پست های خود را به صورت صفحه بندی دریافت کنیم، لازم است تا تایپ FetchResponse را که ساختیم را import کنیم. در داخل کلاس یک تابع static درست می کنیم و با توجه به الگو سرور یک درخواست به سمت سرور ارسال می کنیم و جواب را متناسب با نوع وضعیت آن به صدا زننده این تابع بر می گردانیم.


###### در مرحله بعد حالا نوبت آن است که MyPostComponent را کمی تغییر دهیم و بجای داده های fake که ساختیم، داده های واقعی   را جایگزین کنیم.

###### ابتدا مدل Post را که ساخته ایم import می کنیم.
```bash
import { Post } from 'src/models/post';
```

###### متغیر rows را تغییر می دهیم و قبلی را حذف می کنیم.

```bash
const rows = ref();
```
###### و یک تابع onRequest می سازیم تا از طریق آن درخواست دهیم و پست های مربوط به خودمان را دریافت کنیم.

```bash
const onRequest = (data: any) => {
  if (!data) {
    Post.myPosts(1, data?.filter).then((response) => {
      rows.value = response.data.posts;
      pagination.value.page =
        response.data.meta?.pagination?.posts.current_page ?? 1;
      pagination.value.rowsNumber =
        response.data.meta?.pagination?.posts.total ?? 1;
    });
  } else {
    Post.myPosts(data.pagination.page, data?.filter).then((response) => {
      rows.value = response.data.posts;
      pagination.value.page =
        response.data.meta?.pagination?.posts.current_page ?? 1;
      pagination.value.rowsNumber =
        response.data.meta?.pagination?.posts.total ?? 1;
    });
  }
};
onRequest(null);
```
###### تابع ما مقدار data را دریافت می کند که ممکن است null باشد. اگر null  بود ما درخواست را برای صفحه اول ارسال می کنیم و منتظر پاسخ می مانیم، وقتی پاسخ درست بازگشت، داده ها را در rows می گذاریم و مقدار  current_page و total را در متغیر pagination بروز رسانی می کنیم. دقت کنید که اگر پارامتر فیلتر دارای مقدار بود، باید آن را هم برای سرور ارسال کنیم. در انتها تابع onRequest را به صورت null اجرا می کنیم تا زمانی این فایل صدا زده شد، یکبار این تابع اجرا شود و جدول با داده های مناسب پر شوند.

###### در انتها export خود را به روز می کنیم.

```bash
export { columns, rows, pagination, onRequest };
```

###### حال در فایل MyPostPage باید کمی تغییر به وجود آوریم. ابتدا در بخش script، متغیر های import شده MyPostComponent را بروز می کنیم.

```bash
import { columns, rows, pagination, onRequest } from 'components/ts/MyPostComponent';
```
###### حال نوبت آن است که به بخش template برویم. به تگ q-table مقدار onRequest را می دهیم تا در اثر هر گونه تغییر در شماره صفحه یا نوشته شدن کلمات، جهت فیلتر شدن محتوا، یک درخواست به سمت سرور ارسال کند.

```bash
<q-table
  :grid="$q.screen.xs"
  title="My Posts"
  :rows="rows"
  :columns="columns"
  row-key="name"
  :filter="filter"
  :rows-per-page-options="[pagination.rowsPerPage]"
  v-model:pagination="pagination"
  @request="onRequest"
>
```
###### دقت کنید در q-input مربوط به filter یک props وجود دارد به نام debounce که ما آن را 300 گذاشته ایم. وظیفه debounce این است که در هنگام اجرا به مقدار عددی که داده اید و بر اساس میلی ثانیه حساب می شود، تاخیر ایجاد نماید. یعنی وقتی شروع می کنید به تایپ کردن، بعد از آخرین کاراکتر که نوشته اید، 300 میلی ثانیه می ایستد و سپس مقدار را جهت فیلتر کردن تحویل می دهد.





