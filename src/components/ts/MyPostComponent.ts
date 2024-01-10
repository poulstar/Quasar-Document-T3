import { ref } from 'vue';

const columns: any[] = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'title', align: 'center', label: 'Title', field: 'title', sortable: true },
  { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true,format: (val:string) => `${val.slice(0,40)} ...`, },
]

const rows = ref([
  {
    id: 1,
    image: 'images/mountains.jpg',
    title: 'fake',
    description: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available'
  },
  {
    id: 2,
    image: 'images/mountains.jpg',
    title: 'fake',
    description: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available'
  },

]);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100
})

export {columns, rows, pagination}
