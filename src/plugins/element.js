// element-ui按需引入
import Vue from 'vue'
import {
    Button,
    Form,
    Input,
    FormItem,
    Autocomplete,
    Message,
    Container,
    Header,
    Main,
    Aside,
    Menu,
    MenuItem,
    Submenu,
    Dropdown,
    DropdownMenu,
    DropdownItem
} from 'element-ui'
Vue
    .use(Button)
    .use(Form)
    .use(Input)
    .use(FormItem)
    .use(Autocomplete)
    .use(Container)
    .use(Header)
    .use(Main)
    .use(Aside)
    .use(Menu)
    .use(MenuItem)
    .use(Submenu)
    .use(Dropdown)
    .use(DropdownMenu)
    .use(DropdownItem)
Vue.prototype.$msg = Message