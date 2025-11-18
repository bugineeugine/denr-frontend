import ListSubheader from "@mui/material/ListSubheader";
import React from "react";
import { MenuItemKind } from "./menu-item-list-type";
import { Divider } from "@mui/material";

import CanViewMenuSubHeader from "./CanView/CanViewMenuSubHeader";
import useThemeSettings from "@/themes/useThemeProvider";

type Props = {
  item: MenuItemKind;
};

const MenuItemSubHeader = (props: Props) => {
  const { item } = props;
  const sideBarCollapsed = useThemeSettings((state) => state.sideBarCollapsed);

  if (item.kind === "divider") {
    return (
      <CanViewMenuSubHeader action={item.action}>
        <Divider
          sx={{
            mt: 1,
            mb: 1,
            mx: 1,
          }}
        />
      </CanViewMenuSubHeader>
    );
  }

  return (
    <CanViewMenuSubHeader action={item.action}>
      <ListSubheader
        disableGutters
        component={"div"}
        sx={{
          height: sideBarCollapsed ? "0px" : "40px",
          fontSize: "12px",
          fontWeight: 700,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          transition: "height 0.3s ease",
          zIndex: 2,
          px: 2,
        }}
      >
        {item.title}
      </ListSubheader>
    </CanViewMenuSubHeader>
  );
};

export default MenuItemSubHeader;
