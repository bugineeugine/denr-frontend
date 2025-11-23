import { ComponentType } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface BaseMenuItem {
  label?: string;
  href?: string;
  icon?: ComponentType<SvgIconProps>;
  segment: string;
  action?: string[];
}

export type MenuItemType = BaseMenuItem;

export type MenuItemGroupType = {
  label?: string;
  href?: string;
  icon?: ComponentType<SvgIconProps>;
  segment: string;
  children?: (MenuItemGroupType | BaseMenuItem)[];
  action?: string[];
};

export type MenuItemKind =
  | {
      kind: "header";
      title: string;
      action?: string[];
    }
  | {
      kind: "divider";
      action?: string[];
    };

export type MenuItemListType = (MenuItemType | MenuItemGroupType | MenuItemKind)[];
