import { MenuItemListType } from '@/components/UserLayout/Sidebar/SidebarContent/menu-item-list-type';
import menuListItem from '@/components/UserLayout/Sidebar/SidebarContent/menu-list-item';

const findPathToSegment = (items: MenuItemListType, targetSegment: string, path: string[] = []): string[] | null => {
  for (const item of items) {
    if (!('kind' in item)) {
      const currentPath = [...path, item.segment];
      if (item.segment === targetSegment) {
        return currentPath;
      }

      if ('children' in item && item.children) {
        const foundPath = findPathToSegment(item.children, targetSegment, currentPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
  }
  return null;
};

const getAllSegments = (targetSegment: string) => {
  return findPathToSegment(menuListItem, targetSegment);
};

export { findPathToSegment, getAllSegments };
