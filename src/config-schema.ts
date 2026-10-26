import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  nhfrGlobalPropertyValueName: {
    _type: Type.String,
    _default: 'ugandaemrsync.nhfr.facility.url',
    _description: 'Global property name used to look up the NHFR facility URL.',
  },
  nhcrUrl: {
    _type: Type.String,
    _default: '',
    _description: 'URL of the National Health Care Provider Registry (NHCR).',
  },
  menuItems: {
    _type: Type.Array,
    _description:
      'App menu tiles. Replaces the default list entirely when set. Each item needs a name and icon; ' +
      'give it a path (relative to the SPA base) or an href (external link). Optionally restrict an item ' +
      'to users holding all of the listed privileges, or to online/offline modes.',
    _elements: {
      name: {
        _type: Type.String,
        _description: 'Display title of the menu tile.',
      },
      icon: {
        _type: Type.String,
        _description: 'Carbon icon name in kebab-case (e.g. "settings", "report-data").',
      },
      path: {
        _type: Type.String,
        _description: 'Route relative to the SPA base URL.',
      },
      href: {
        _type: Type.String,
        _description: 'Absolute URL. Takes precedence over path when both are set.',
      },
      privileges: {
        _type: Type.Array,
        _elements: { _type: Type.String },
        _description: 'User must hold ALL of these privileges to see the item.',
      },
      online: {
        _type: Type.Boolean,
        _default: true,
        _description: 'Whether the item is shown when online.',
      },
      offline: {
        _type: Type.Boolean,
        _default: true,
        _description: 'Whether the item is shown when offline.',
      },
    },
    _default: [
      { name: 'Bed Management', icon: 'hospital-bed', path: 'bed-management' },
      { name: 'Supplies Dispensing', icon: 'medication', path: 'supplies-dispensing' },
      { name: 'Form Builder', icon: 'document-add', path: 'form-builder' },
      { name: 'System Admin', icon: 'settings', path: 'system-admin' },
      { name: 'Legacy Admin', icon: 'user', href: '/openmrs/admin/index.htm' },
      { name: 'Cohort Builder', icon: 'events', path: 'cohort-builder' },
      { name: 'Form Render', icon: 'document-import', path: 'form-render-test' },
      { name: 'Dispensing', icon: 'medication', path: 'dispensing' },
      { name: 'Report Builder', icon: 'report-data', path: 'report-builder' },
      { name: 'Run Reports', icon: 'play', path: 'report-builder/run' },
      { name: 'Billable Services', icon: 'receipt', path: 'billable-services' },
    ],
  },
};

export interface MenuItemConfig {
  name: string;
  icon: string;
  path?: string;
  href?: string;
  privileges?: Array<string>;
  online?: boolean;
  offline?: boolean;
}

export type Config = {
  nhfrGlobalPropertyValueName: string;
  nhcrUrl: string;
  menuItems?: Array<MenuItemConfig>;
};
