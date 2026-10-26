import React, { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "@carbon/react";

import {
  type AssignedExtension,
  Extension,
  useAssignedExtensions,
  useConfig,
  useConnectivity,
  useSession,
} from "@openmrs/esm-framework";
import { ComponentContext } from "@openmrs/esm-framework/src/internal";

import { type Config, type MenuItemConfig } from "../../config-schema";
import { getIcon } from "../../menu-app-items/icons";
import Item from "../../menu-app-items/item.component";
import itemStyles from "../../menu-app-items/item.scss";
import styles from "./app-search-bar.scss";

const appMenuItemSlot = "app-menu-item-slot";

interface AppSearchBarProps {
  onChange?: (searchTerm: string) => void;
  onClear: () => void;
  onSubmit: (searchTerm: string) => void;
  small?: boolean;
}

const AppSearchBar = React.forwardRef<HTMLInputElement, AppSearchBarProps>(
  ({ onChange, onClear, onSubmit, small }, ref) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (val: string) => {
      setSearchTerm(val);
      if (onChange) {
        onChange(val);
      }
    };

    const handleSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      if (onSubmit) {
        onSubmit(searchTerm);
      }
    };

    return (
      <>
        <form onSubmit={handleSubmit} className={styles.searchArea}>
          <Search
            autoFocus
            className={styles.appSearchInput}
            closeButtonLabelText={t("clearSearch", "Clear")}
            labelText=""
            onChange={(event) => handleChange(event.target.value)}
            onClear={onClear}
            placeholder={t("searchForApp", "Search for an application")}
            size={small ? "sm" : "lg"}
            value={searchTerm}
            ref={ref}
            data-testid="appSearchBar"
          />
        </form>
        <div className={styles.searchItems}>
          <Suspense fallback={null}>
            <MenuItemsGrid searchTerm={searchTerm} />
          </Suspense>
        </div>
      </>
    );
  }
);

function MenuItemsGrid({ searchTerm }: { searchTerm: string }) {
  const { menuItems } = useConfig<Config>();
  const session = useSession();
  const isOnline = useConnectivity();
  const menuItemExtensions = useAssignedExtensions(
    appMenuItemSlot
  ) as AssignedExtension[];

  const searchTermLower = searchTerm?.trim().toLowerCase();
  const matches = (displayName: string) =>
    !searchTermLower || displayName.toLowerCase().includes(searchTermLower);

  const hasAllPrivileges = (requiredPrivileges?: Array<string>) => {
    if (!requiredPrivileges?.length) {
      return true;
    }
    const userPrivileges = session?.user?.privileges ?? [];
    return requiredPrivileges.every((required) =>
      userPrivileges.some(
        (privilege) =>
          privilege?.display === required || privilege?.name === required
      )
    );
  };

  const isAvailable = (item: Pick<MenuItemConfig, "online" | "offline">) =>
    isOnline ? item.online !== false : item.offline !== false;

  const configTiles = (menuItems ?? [])
    .filter((item) => item?.name && matches(item.name))
    .filter((item) => hasAllPrivileges(item.privileges))
    .filter((item) => isAvailable(item))
    .map((item) => (
      <Item
        key={item.name}
        className={itemStyles.customTile}
        title={item.name}
        icon={getIcon(item.icon)}
        to={item.path}
        href={item.href}
      />
    ));

  const extensionTiles = menuItemExtensions
    .map((extension) => ({
      extension,
      displayName: extension?.meta?.name ?? extension?.name ?? "",
    }))
    .filter(({ displayName }) => matches(displayName))
    .map(({ extension }) => (
      <ComponentContext.Provider
        key={extension?.id}
        value={{
          moduleName: extension?.moduleName,
          featureName: "app-search-button",
          extension: {
            extensionId: extension?.id,
            extensionSlotName: appMenuItemSlot,
            extensionSlotModuleName: extension?.moduleName,
          },
        }}
      >
        <Extension />
      </ComponentContext.Provider>
    ));

  return (
    <>
      {configTiles}
      {extensionTiles}
    </>
  );
}

export default AppSearchBar;
