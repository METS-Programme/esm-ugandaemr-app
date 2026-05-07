import { omrsGet } from './openmrs-api';
import type { EncounterTypeReference } from '../sync-profiles.types';

const RESOURCE = '/encountertype';
const customRepresentation = 'custom:(uuid,display,description)';

type EncounterTypeSearchResponse = {
  results: EncounterTypeReference[];
};

export async function searchEncounterTypes(query: string, signal?: AbortSignal): Promise<EncounterTypeReference[]> {
  if (query.trim().length < 2) {
    return [];
  }
  const res = await omrsGet<EncounterTypeSearchResponse>(
    `${RESOURCE}?q=${encodeURIComponent(query)}&v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
  return res?.results ?? [];
}

export async function getEncounterTypeByUuid(uuid: string, signal?: AbortSignal): Promise<EncounterTypeReference> {
  const u = String(uuid ?? '').trim();
  if (!u) {
    throw new Error('Encounter type uuid is required');
  }
  return omrsGet<EncounterTypeReference>(
    `${RESOURCE}/${encodeURIComponent(u)}?v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
}

export async function getEncounterTypesByUuids(uuids: string[], signal?: AbortSignal): Promise<EncounterTypeReference[]> {
  const validUuids = uuids.filter((u) => u && u.trim().length > 0);
  if (validUuids.length === 0) {
    return [];
  }
  const encounterTypes = await Promise.allSettled(
    validUuids.map((uuid) => getEncounterTypeByUuid(uuid, signal)),
  );
  return encounterTypes
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<EncounterTypeReference>).value);
}

export function toSelectedEncounterType(et: EncounterTypeReference): EncounterTypeReference {
  return {
    uuid: et.uuid,
    display: et.display,
    description: et.description,
  };
}
