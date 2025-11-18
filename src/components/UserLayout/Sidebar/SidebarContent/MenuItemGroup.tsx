import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { MenuItemGroupType } from "./menu-item-list-type";

import MenuItemList from "./MenuItemList";
import Collapse from "@mui/material/Collapse";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import CanViewMenuItemGroup from "./CanView/CanViewMenuItemGroup";
import useThemeSettings from "@/themes/useThemeProvider";
import themeConfig from "@/themes/config";

type Props = {
  item: MenuItemGroupType;
  hasParent?: boolean;
  level?: number;
};

const MenuItemGroup = (props: Props) => {
  const { item, level = 0, hasParent = false } = props;
  const IconTag = item.icon ? item.icon : themeConfig.defaultIcon;
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);
  const activeMenu = useThemeSettings((state) => state.activeMenu);
  const handleActiveMenu = useThemeSettings((state) => state.handleActiveMenu);
  const pathName = usePathname();
  const isActive = pathName.split("/").includes(item.segment);

  const iconSx = useMemo(() => {
    return hasParent && item.icon
      ? {
          ml: 1,
          mr: "6.5px",
        }
      : hasParent && !item.icon
        ? {
            ml: 1.9,
            mr: "13.3px",
          }
        : {
            ml: 0,
            mr: "14.6px",
          };
  }, [hasParent, item.icon]);

  return (
    <CanViewMenuItemGroup item={item}>
      <ListItem disablePadding sx={{ px: 1 }} className="py-0.5">
        <ListItemButton
          onClick={() => handleActiveMenu(item.segment)}
          sx={{
            ...(hasParent && {
              paddingLeft: level * 2,
            }),
            backgroundColor: isActive ? "var(--mui-palette-action-hover)" : "",
            borderRadius: "var(--mui-shape-borderRadius) ",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, ...iconSx }}>
            <IconTag sx={{ ...(hasParent && !item.icon && { fontSize: 10 }) }} />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{
              whiteSpace: "nowrap",
              zIndex: 1,
              minWidth: "25px",
              opacity: sideBarCollapsed ? 0 : 1,
              transition: " opacity 0.3s ease-in-out",
            }}
            slotProps={{
              primary: {
                sx: {
                  letterSpacing: " 0.00938em",
                },
              },
            }}
          />
          <KeyboardArrowRightIcon
            sx={{
              opacity: sideBarCollapsed ? 0 : 1,
              transform: `rotate(${sideBarCollapsed ? false : activeMenu.includes(item.segment) ? "90deg" : "0deg"})`,
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              position: "absolute",
              right: 0,
            }}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={activeMenu.includes(item.segment)} timeout="auto" unmountOnExit>
        {!sideBarCollapsed && (
          <List dense disablePadding>
            <MenuItemList
              {...props}
              items={item.children}
              hasParent={Boolean(item.children && item.children.length)}
              level={level + 1}
            />
          </List>
        )}
      </Collapse>
    </CanViewMenuItemGroup>
  );
};

export default MenuItemGroup;
