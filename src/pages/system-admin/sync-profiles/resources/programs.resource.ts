import { omrsGet } from './openmrs-api';
import type { ProgramReference } from '../sync-profiles.types';

const RESOURCE = '/program';
const customRepresentation = 'custom:(uuid,display,description)';

type ProgramSearchResponse = {
  results: ProgramReference[];
};

export async function searchPrograms(query: string, signal?: AbortSignal): Promise<ProgramReference[]> {
  if (query.trim().length < 2) {
    return [];
  }
  const res = await omrsGet<ProgramSearchResponse>(
    `${RESOURCE}?q=${encodeURIComponent(query)}&v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
  return res?.results ?? [];
}

export async function getProgramByUuid(uuid: string, signal?: AbortSignal): Promise<ProgramReference> {
  const u = String(uuid ?? '').trim();
  if (!u) {
    throw new Error('Program uuid is required');
  }
  return omrsGet<ProgramReference>(
    `${RESOURCE}/${encodeURIComponent(u)}?v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
}

export async function getProgramsByUuids(uuids: string[], signal?: AbortSignal): Promise<ProgramReference[]> {
  const validUuids = uuids.filter((u) => u && u.trim().length > 0);
  if (validUuids.length === 0) {
    return [];
  }
  const programs = await Promise.allSettled(
    validUuids.map((uuid) => getProgramByUuid(uuid, signal)),
  );
  return programs
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<ProgramReference>).value);
}

export function toSelectedProgram(p: ProgramReference): ProgramReference {
  return {
    uuid: p.uuid,
    display: p.display,
    description: p.description,
  };
}
