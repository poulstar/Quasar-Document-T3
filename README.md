# دریافت و نمایش کل پست ها برای admin با استفاده از API همراه با قابلیت فیلتر کردن داده ها و همچنین Pagination


###### برای اینکه بخش مدیر سایت بتواند پست های کل سایت را ببیند، لازم است ابتدا تابع ارسال کننده درخواست جهت دیدن کلیه پست ها را در مدل Post بسازیم. دقت کنید که اگر نقش کاربر شما admin نباشد. با خطا 403 رو به رو می شوید، یعنی عدم دسترسی. حال با توجه به الگو موجود در سرور، درخواست خود را به صورت زیر می نویسیم.

```bash
static async allPostsForAdmin(page: number, filter: string) {
  const response = await api.get<FetchResponse<Post>>(
    `api/all-posts-for-admin?page=${page}&filter=${filter ?? ''}`
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('All Posts failed');
}
```

###### حال کار بعدی ای که باید انجام دهیم، تغییر فایل AllPostComponent است که درخواست به سرور را انجام دهد و داده های دریافتی را متناسب با الگو خود در متغیر row گذاشته و export کنیم. ابتدا column خود را ویرایش می کنیم.

```bash
{
  name: 'username',
  align: 'center',
  label: 'User Name',
  field: 'user',
  sortable: true,
  format: (val: any) => `${val.name}`,
},
```
###### در ستون username به دلیل اینکه field ارسال شده از سمت سرور user است از username به user تغییر می دهیم.

###### حال تابع request را می نویسیم ت بتوان درخواست دریافت اطلاعات را ساخت. دقت کنید در اینجا هم مثل MyPostComponent ما موقع ارسال یک data دریافت می کنیم و اگر data ما null باشد برای صفحه اول درخواست می کنیم و اگر در data مقدار filter هم وجود داشت، آن را هم ارسال می کنیم. پس از دریافت کل داده های را در rows می گذاریم و pagination  را به روز می کنیم.
```bash
const rows = ref();
const onRequest = (data: any) => {
  if (!data) {
    Post.allPostsForAdmin(1, data?.filter).then((response) => {
      rows.value = response.data.posts;
      pagination.value.page =
        response.data.meta?.pagination?.posts.current_page ?? 1;
      pagination.value.rowsNumber =
        response.data.meta?.pagination?.posts.total ?? 1;
    });
  } else {
    Post.allPostsForAdmin(data.pagination.page, data?.filter).then(
      (response) => {
        rows.value = response.data.posts;
        pagination.value.page =
          response.data.meta?.pagination?.posts.current_page ?? 1;
        pagination.value.rowsNumber =
          response.data.meta?.pagination?.posts.total ?? 1;
      }
    );
  }
};
onRequest(null);
```
###### بعد اینکه تابع را ساختیم حال نوبت آن است که نام آن را در export اضافه کنیم.

```bash
export { columns, rows, pagination, onRequest };
```
###### حال باید به سراغ فایل AllPostPage برویم تا آن را ویرایش کنیم. ابتدا وارد script شده و در import های component مورد نظر ما یعنی AllPostComponent مقدار onRequest را اضافه می کنیم.

```bash
import { columns,rows,pagination,onRequest } from 'components/ts/AllPostComponent';
```
###### بعد آن سراغ بخش تابع deletePost می رویم. ابتدا متغیری می سازیم تا آدرس سرور را در آن ذخیره کرده باشیم و بتوانیم آن را به آدرس تصویر پست اضافه کنیم. سپس تابع deletePost را به صورت زیر ویرایش می کنیم.
```bash
const serverRoute = 'https://openapi.poulstar.org/';

const deletePost = (row: any) => {
  deletePostParameter.value.id = row.id;
  deletePostParameter.value.image = serverRoute + row.media[0].url;
  deletePostParameter.value.title = row.title;
  deletePostParameter.value.username = row.user.name;
  deletePostParameter.value.description = row.description;
  deletePostParameter.value.modal = !deletePostParameter.value.modal;
};
```
###### حال نوبت آن است که وارد template شده و props مورد نظر خود یعنی request را به q-table اضافه کنیم.
```bash
<q-table
  :grid="$q.screen.xs"
  title="All Posts"
  :rows="rows"
  :columns="columns"
  row-key="name"
  :filter="filter"
  :rows-per-page-options="[pagination.rowsPerPage]"
  v-model:pagination="pagination"
  @request="onRequest"
>
```
###### حال لیست کردن همه پست ها از جدید ترین تا قدیمی ترین آن ها برای مدیر سایت آماده شده است و می توانید از آن استفاده کنید.








