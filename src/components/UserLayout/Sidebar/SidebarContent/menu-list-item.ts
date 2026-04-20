import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import { MenuItemListType } from "./menu-item-list-type";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

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
    label: "Applications",
    icon: DescriptionOutlinedIcon,
    href: "/permits",
    segment: "permits",
    action: ["canViewPermits"],
  },

  {
    label: "Violations",
    icon: ReportProblemOutlinedIcon,
    href: "/violations",
    segment: "violations",
  },
  {
    label: "Request Applications",
    segment: "approval",
    icon: ApprovalOutlinedIcon,
    children: [
      {
        label: "For Approval",
        href: "/for-approval",
        segment: "for-approval",
        action: ["canViewForApproval"],
      },
      {
        label: "History Approved",
        href: "/history-approve",
        segment: "history-approve",
        action: ["canViewHistoryApprove"],
      },
    ],
  },
];

export default menuListItem;
