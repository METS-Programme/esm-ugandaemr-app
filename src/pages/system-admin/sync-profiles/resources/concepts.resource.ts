import { omrsGet } from './openmrs-api';
import type { ConceptSummary, SelectedConcept } from './concept-types';

const RESOURCE = '/concept';
const customRepresentation = 'custom:(uuid,display,id,datatype:(uuid,name),conceptClass:(uuid,name),mappings:(display,uuid,conceptMapType:(display)))';

type ConceptSearchResponse = {
  results: ConceptSummary[];
};

export async function searchConcepts(query: string, signal?: AbortSignal): Promise<ConceptSummary[]> {
  if (query.trim().length < 2) {
    return [];
  }
  const res = await omrsGet<ConceptSearchResponse>(
    `${RESOURCE}?q=${encodeURIComponent(query)}&v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
  return res?.results ?? [];
}

export async function getConceptByUuid(uuid: string, signal?: AbortSignal): Promise<ConceptSummary> {
  const u = String(uuid ?? '').trim();
  if (!u) {
    throw new Error('Concept uuid is required');
  }
  return omrsGet<ConceptSummary>(
    `${RESOURCE}/${encodeURIComponent(u)}?v=${encodeURIComponent(customRepresentation)}`,
    signal,
  );
}

export async function getConceptsByUuids(uuids: string[], signal?: AbortSignal): Promise<ConceptSummary[]> {
  const validUuids = uuids.filter((u) => u && u.trim().length > 0);
  if (validUuids.length === 0) {
    return [];
  }
  const concepts = await Promise.allSettled(
    validUuids.map((uuid) => getConceptByUuid(uuid, signal)),
  );
  return concepts
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<ConceptSummary>).value);
}

export function toSelectedConcept(c: ConceptSummary): SelectedConcept {
  return {
    uuid: c.uuid,
    display: c.display,
    id: c.id,
    conceptClass: c.conceptClass?.name,
    datatype: c.datatype?.name,
  };
}
