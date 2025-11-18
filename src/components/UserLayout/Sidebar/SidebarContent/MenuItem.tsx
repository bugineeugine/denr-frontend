import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { MenuItemType } from "./menu-item-list-type";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { getAllSegments } from "@/utils/getAllSegment";
import { useMemo } from "react";
import CanViewMenuItem from "./CanView/CanViewMenuItem";
import useThemeSettings from "@/themes/useThemeProvider";
import themeConfig from "@/themes/config";

type Props = {
  item: MenuItemType;
  hasParent?: boolean;
  level?: number;
};

const MenuItem = (props: Props) => {
  const { item, level = 0, hasParent = false } = props;
  const IconTag = item.icon ? item.icon : themeConfig.defaultIcon;
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);
  const segments = useSelectedLayoutSegments();
  const isActive = segments.includes(item.segment);
  const link = "/" + getAllSegments(item.segment)?.join("/");
  const isActiveSx = isActive && {
    color: "var(--mui-palette-primary-dark)",
    fontWeight: 500,
  };

  const iconSx = useMemo(() => {
    return hasParent && item.icon
      ? {
          ml: 1,
          mr: "6.5px",
        }
      : hasParent && !item.icon
        ? {
            ml: 2.2,
            mr: "16px",
          }
        : {
            ml: 0,
            mr: "14.6px",
          };
  }, [hasParent, item.icon]);

  return (
    <CanViewMenuItem action={item?.action || ""}>
      <ListItem disablePadding sx={{ px: 1 }} className="py-0.5">
        <Tooltip
          placement="right-end"
          title={item.label}
          disableHoverListener={!sideBarCollapsed}
          disableFocusListener={!sideBarCollapsed}
          disableTouchListener={!sideBarCollapsed}
        >
          <ListItemButton
            selected={isActive}
            href={link}
            sx={{
              ...(hasParent && {
                pl: level * 2,
              }),
              borderRadius: "var(--mui-shape-borderRadius)",
            }}
            LinkComponent={Link}
          >
            <ListItemIcon sx={{ minWidth: 0, ...iconSx, ...isActiveSx }}>
              <IconTag sx={{ ...(hasParent && !item.icon && { fontSize: 5 }) }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    ...isActiveSx,
                  },
                  className: "truncate",
                },
              }}
              sx={{
                whiteSpace: "nowrap",
                zIndex: 1,
                minWidth: "25px",
                opacity: sideBarCollapsed ? 0 : 1,
                transition: " opacity 0.3s ease-in-out",
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>
    </CanViewMenuItem>
  );
};

export default MenuItem;
