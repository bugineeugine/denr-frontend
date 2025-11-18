import React from 'react';
import { MenuItemListType, MenuItemType, MenuItemGroupType, MenuItemKind } from './menu-item-list-type';
import MenuItemGroup from './MenuItemGroup';
import MenuItem from './MenuItem';
import MenuItemSubHeader from './MenuItemSubHeader';

type Props = {
  items?: MenuItemListType;
  hasParent?: boolean;
  level?: number;
};

const MenuItemList = (props: Props) => {
  const { items = [] } = props;

  const menuItemList = items.map((value: MenuItemType | MenuItemGroupType | MenuItemKind, index: number) => {
    if ((value as MenuItemKind).kind) {
      return <MenuItemSubHeader {...props} key={index} item={value as MenuItemKind} />;
    }

    if ((value as MenuItemGroupType).children) {
      return <MenuItemGroup {...props} key={index} item={value as MenuItemGroupType} />;
    }

    return <MenuItem {...props} key={index} item={value as MenuItemType} />;
  });

  return <>{menuItemList}</>;
};

export default MenuItemList;
