# دریافت و نمایش کل کاربر ها برای admin با استفاده از API همراه با قابلیت فیلتر کردن داده ها و همچنین Pagination


###### برای اینکه تمام کاربر ها نرم افزار خود را دریافت کنیم. ابتدا در مدل user کار هایی که لازم است انجام دهیم  را پیش می گیریم و بعد تابع static خود را می سازیم.

###### گام اول در مدل User تایپی که ساخته بودیم یعنی FetchResponse را import می کنیم.
```bash
import { FetchResponse } from 'src/models/types';
```

###### حال نوبت آن است که تابع static خود را داخل مدل User بنویسیم.
```bash
static async allUserForAdmin(page: number, filter: string) {
  const response = await api.get<FetchResponse<User>>(
    `api/all-users?page=${page}&filter=${filter ?? ''}`
  );
  if (response.status == 200) {
    return response;
  }
  throw Error('Get All User For Admin Failed');
}
```
###### وارد AllUserComponent می شویم و از تابعی که نوشتیم استفاده می کنیم تا بجای کاربر های موقت و جعلی ما، داده های واقعی جایگزین شوند. ابتدا مدل User را import می کنیم.
```bash
import { User } from 'src/models/user';
```
###### بعد آن سراغ تابع rows می رویم و آن را خالی می کنیم و تابع onRequest را می سازیم، باز هم مثل دفعات قبل یک مقدار data دریافت می کنیم، اگر data برابر با null بود درخواست را برای صفحه یک می دهیم، در غیر این صورت درخواست را برای صفحه ای که pagination تعیین می کند می فرستیم. اگر هم مقدار فیلتر پر شده بود، مقدار فیلتر را پر می کنیم. وقتی جواب سرور هم بازگشت مقدار pagination را بروز می کنیم.
```bash
const rows = ref();
const onRequest = (data: any) => {
  if (!data) {
    User.allUserForAdmin(1, data?.filter).then((response) => {
      rows.value = response.data.users;
      pagination.value.page =
        response.data.meta?.pagination?.users.current_page ?? 1;
      pagination.value.rowsNumber =
        response.data.meta?.pagination?.users.total ?? 1;
    });
  } else {
    User.allUserForAdmin(data.pagination.page, data?.filter).then(
      (response) => {
        rows.value = response.data.users;
        pagination.value.page =
          response.data.meta?.pagination?.users.current_page ?? 1;
        pagination.value.rowsNumber =
          response.data.meta?.pagination?.users.total ?? 1;
      }
    );
  }
};
onRequest(null);
```
###### در آخر نوبت می رسد به export،  ویرایشش می کنیم و onRequest را به آن اضافه می کنیم
```bash
export { columns, rows, pagination, onRequest };
```
###### وارد AllUserPage می شویم و به بخش script می شویم و اول import های مربوط به AllUserComponent را ویرایش می کنیم.

```bash
import { columns, rows, pagination, onRequest } from 'components/ts/AllUserComponent';
```
###### سراغ تابع updateUser می رویم و مقدار role را به roles تبدیل می کنیم تا نقش آمده از سمت سرور را بتواند دریافت و نمایش دهد.
```bash
const updateUser = (row: any) => {
  updateUserParameter.value.id = row.id;
  updateUserParameter.value.name = row.name;
  updateUserParameter.value.email = row.email;
  updateUserParameter.value.role = row.roles[0].name;
  updateUserParameter.value.modal = !updateUserParameter.value.modal;
};
```
###### حال نوبت آن است که q-table را ویرایش کنیم و مقدار onRequest را به آن اضافه کنیم.
```bash
<q-table
  :grid="$q.screen.xs"
  title="All Users"
  :rows="rows"
  :columns="columns"
  row-key="name"
  :filter="filter"
  :rows-per-page-options="[pagination.rowsPerPage]"
  v-model:pagination="pagination"
  @request="onRequest"
>
```
###### حال می توانید در بخش مدیریت تمام کاربر های نرم افزار خود را به صورت صفحه بندی شده مشاهده کنید.

