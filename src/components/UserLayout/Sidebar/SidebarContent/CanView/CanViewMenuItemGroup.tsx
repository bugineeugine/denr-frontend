import React, { ReactNode } from "react";
import { MenuItemGroupType } from "../menu-item-list-type";
import useAuth from "@/store/useAuth";

const CanViewMenuItemGroup = ({ children, item }: { children: ReactNode; item: MenuItemGroupType }) => {
  const userData = useAuth((state) => state.userData);
  const permissions = userData?.permissions ?? [];
  const hasAccess = (item: MenuItemGroupType): boolean | undefined => {
    const hasAnyVisibleChild =
      item.children &&
      item.children.some((el: MenuItemGroupType) => {
        if (el.children) {
          return hasAccess(el);
        }

        return el.action?.some((element) => permissions.includes(element)) || !el.action;
      });

    if (!item.action) {
      return hasAnyVisibleChild;
    }

    return item.action?.some((element) => permissions.includes(element)) && hasAnyVisibleChild;
  };

  return item && hasAccess(item) ? <>{children}</> : null;
};

export default CanViewMenuItemGroup;
