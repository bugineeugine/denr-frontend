import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import { MenuItemListType } from "./menu-item-list-type";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
const menuListItem: MenuItemListType = [
  {
    label: "Dashboard",
    icon: DashboardIcon,
    href: "/dashboard",
    segment: "dashboard",
  },
  {
    label: "Users",
    icon: GroupsOutlinedIcon,
    href: "/users",
    segment: "users",
    action: ["canViewUsers"],
  },
  {
    label: "Permits",
    icon: DescriptionOutlinedIcon,
    href: "/permits",
    segment: "permits",
    action: ["canViewPermits"],
  },
];

export default menuListItem;
