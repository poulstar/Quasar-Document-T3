import{ mdiSearchWeb ,mdiHome, mdiNote, mdiNoteMultiple, mdiAccountGroup} from '@quasar/extras/mdi-v7';

type menuItem = {name: string, route: string, icon: string};

function menu() {
  return [
    { name: 'Search', route: 'search', icon: mdiSearchWeb },
    { name: 'Dashboard', route: 'index', icon: mdiHome },
    { name: 'My Post', route: 'myPost', icon: mdiNote },
    { name: 'All Post', route: 'allPost', icon: mdiNoteMultiple },
    { name: 'All User', route: 'allUser', icon: mdiAccountGroup },
  ] as menuItem[];
}

export const accessMenu = menu();
