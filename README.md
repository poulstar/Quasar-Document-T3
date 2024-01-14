# پیاده سازی حذف کل کاربر ها برای admin با استفاده از API و بروز رسانی لیست کاربر ها


###### برای اینکه مدیر سایت بتواند هر کاربری که دلش می خواهد را پاک کند، ابتدا باید  تابع  آن را در مدل User بنویسیم و متناسب با ساختاری که سرور خواسته، درخواست را ارسال کنیم.
```bash
static async deleteUserByAdmin(id: number) {
  const response = await api.get(`api/delete-user-by-admin/${id}`);
  if (response.status == 200) {
    return response;
  }
  throw Error('Delete User failed');
}
```
###### در مرحله بعد وارد component خود یعنی AdminDeleteUser می شویم و در بخش script مدل خود را import می کنیم.
```bash
import { User } from 'src/models/user';
```
###### برای اینکه component ما بتواند بعد از تمام کردن کار لست را بروز کند، مقدار refresh را به props اضافه می کنیم.
```bash
const props = defineProps({
  modal: {
    default: false,
  },
  data: {},
  refresh: {},
});
```
###### حال نوبت آن است که تابع accepted را درست کنیم تا وقتی فراخوانی شد، درخواست دهد تا کاربر مورد نظر ما پاک شود و اگر موفق بود بلافاصله لیست جدول بروز کند و dialog را ببندد و اگر نا موفق بود، خطا بازگشتی از سمت سرور را چاپ کند.

```bash
User.deleteUserByAdmin(props.data.id).then(
  (response) => {
    if (response.status == 200) {
      props.refresh();
      emit.call(this, 'update:modal', false);
    }
  },
  (reject) => {
    if (reject.response.status != 200) {
      if (reject.response.data.errors) {
        console.log(reject.response.data.errors);
      }
    }
  }
);
```
###### حال نوبت آن است که وارد AllUserPage شویم و در بخش template برای آنکه component مورد نظر ما تابع onRequest را در اختیار داشته باشد، مقدار refresh را در AdminDeleteUser برابر با onRequest قرار می دهیم.
```bash
<AdminDeleteUser
  v-model:modal="deleteUserParameter.modal"
  v-model:data="deleteUserParameter"
  :refresh="onRequest"
></AdminDeleteUser>
```




