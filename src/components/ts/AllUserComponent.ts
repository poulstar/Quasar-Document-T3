import { ref } from 'vue';

const columns: any[] = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'name', align: 'center', label: 'User Name', field: 'name', sortable: true },
  { name: 'email', align: 'center', label: 'E-Mail', field: 'email', sortable: true },
]

const rows = ref([
  {
    id: 1,
    name: 'hossein',
    email: 'hossein@gmail.com',
    role: [{name:'admin'}]
  },
  {
    id: 2,
    name: 'hossein',
    email: 'hossein@gmail.com',
    role: [{name:'user'}]
  },,

]);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100
})

export {columns, rows, pagination}
