import {
  Application,
  DocumentAdd,
  DocumentImport,
  Events,
  HospitalBed,
  Medication,
  Play,
  Receipt,
  ReportData,
  Settings,
  User,
  type CarbonIconType,
} from '@carbon/react/icons';

/**
 * Registry of Carbon icons available to configured menu items, keyed by
 * kebab-case icon name (as used in the `menuItems` module config).
 */
const ICON_REGISTRY: Record<string, CarbonIconType> = {
  application: Application,
  'bed-management': HospitalBed,
  'cohort-builder': Events,
  'dispensing': Medication,
  'document-add': DocumentAdd,
  'document-import': DocumentImport,
  'events': Events,
  'form-builder': DocumentAdd,
  'hospital-bed': HospitalBed,
  'medication': Medication,
  'play': Play,
  'receipt': Receipt,
  'report-builder': ReportData,
  'report-data': ReportData,
  'settings': Settings,
  'user': User,
};

export function getIcon(name: string): CarbonIconType {
  return ICON_REGISTRY[name?.toLowerCase()] ?? Application;
}
