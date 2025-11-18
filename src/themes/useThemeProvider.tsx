import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import themeConfig from './config';

type ThemeSettingsState = {
  mode: 'dark' | 'light';
  sideBarCollapsed: boolean;
  sideBarVisibility: boolean;
  activeMenu: string[];
  activeMenuCurrent: string[];
  activeSegments: string[];
  sideBarWidth: number;
};

type ThemeSettingsStateAction = {
  toggleMode: () => void;
  setCollapseSideBar: () => void;
  toggleSideBarCollapsed: (val: boolean) => void;
  setSideBarVisibility: (val: boolean) => void;
  toggleSideBarVisibility: () => void;
  handleActiveMenu: (title: string) => void;
  setActiveMenu: (val: string[]) => void;
  setActiveMenuCurrent: (val: string[]) => void;
  setSidebarWidth: (val: number) => void;
};

const useThemeSettings = create<ThemeSettingsStateAction & ThemeSettingsState>()(
  persist(
    (set, get) => ({
      mode: themeConfig.mode,
      sideBarCollapsed: themeConfig.sideBarCollapsed,
      sideBarVisibility: themeConfig.sideBarVisibility,
      activeMenu: [],
      activeMenuCurrent: [],
      activeSegments: [],
      sideBarWidth: themeConfig.sideBarExpandedWidth,
      setSidebarWidth: val => set(() => ({ sideBarWidth: val })),
      toggleMode: () =>
        set(state => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      setCollapseSideBar: () =>
        set(state => ({
          sideBarCollapsed: !state.sideBarCollapsed,
        })),
      toggleSideBarCollapsed: (val: boolean) =>
        set(() => ({
          sideBarCollapsed: val,
        })),
      setSideBarVisibility: val =>
        set(() => ({
          sideBarVisibility: val,
        })),
      toggleSideBarVisibility: () =>
        set(state => ({
          sideBarVisibility: !state.sideBarVisibility,
        })),
      handleActiveMenu: (segment: string) => {
        const activeMenu = get().activeMenu;
        const openGroups = activeMenu;

        if (openGroups.includes(segment)) {
          openGroups.splice(openGroups.indexOf(segment), 1);
        } else {
          openGroups.push(segment);
        }

        set(() => ({
          activeMenu: [...openGroups],
        }));
      },
      setActiveMenu: val => {
        set(() => ({
          activeMenu: [...val],
        }));
      },
      setActiveMenuCurrent: val => {
        set(() => ({
          activeMenuCurrent: [...val],
        }));
      },
    }),
    {
      name: 'themeSettings',
      partialize: state => Object.fromEntries(Object.entries(state).filter(([key]) => !['activeMenu', 'activeMenuCurrent', 'activeSegments'].includes(key))),
    }
  )
);

export default useThemeSettings;
