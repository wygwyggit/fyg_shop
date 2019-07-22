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
    DropdownItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Radio,
    Cascader,
    Alert,
    Tabs,
    TabPane
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
    .use(Breadcrumb)
    .use(BreadcrumbItem)
    .use(Card)
    .use(Row)
    .use(Col)
    .use(Table)
    .use(TableColumn)
    .use(Switch)
    .use(Tooltip)
    .use(Pagination)
    .use(Dialog)
    .use(Tag)
    .use(Tree)
    .use(Radio)
    .use(Cascader)
    .use(Alert)
    .use(Tabs)
    .use(TabPane)
Vue.prototype.$msg = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$comfirm = MessageBox.confirm