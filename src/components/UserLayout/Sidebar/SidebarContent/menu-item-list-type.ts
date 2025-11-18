import { ComponentType } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { PermissionMap } from '@/components/HasPermissionsClient';

type Permission = PermissionMap[keyof PermissionMap];

interface BaseMenuItem {
  label?: string;
  href?: string;
  icon?: ComponentType<SvgIconProps>;
  segment: string;
  action?: Permission[];
}

export type MenuItemType = BaseMenuItem;

export type MenuItemGroupType = {
  label?: string;
  href?: string;
  icon?: ComponentType<SvgIconProps>;
  segment: string;
  children?: (MenuItemGroupType | BaseMenuItem)[];
  action?: Permission[];
};

export type MenuItemKind =
  | {
      kind: 'header';
      title: string;
      action?: Permission[];
    }
  | {
      kind: 'divider';
      action?: Permission[];
    };

export type MenuItemListType = (MenuItemType | MenuItemGroupType | MenuItemKind)[];
