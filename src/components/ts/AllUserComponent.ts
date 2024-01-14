import { ref } from 'vue';
import { User } from 'src/models/user';

const columns: any[] = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  {
    name: 'name',
    align: 'center',
    label: 'User Name',
    field: 'name',
    sortable: true,
  },
  {
    name: 'email',
    align: 'center',
    label: 'E-Mail',
    field: 'email',
    sortable: true,
  },
];

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

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100,
});

export { columns, rows, pagination, onRequest };
