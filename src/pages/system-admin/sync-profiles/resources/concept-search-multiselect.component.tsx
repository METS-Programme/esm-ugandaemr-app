import React from 'react';
import { ComboBox, InlineLoading, Tag } from '@carbon/react';

import { useConceptSearch } from './useConceptSearch';
import type { ConceptSummary, SelectedConcept } from './concept-types';

type Props = {
  id: string;
  labelText: string;
  placeholder?: string;
  helperText?: string;
  value: SelectedConcept[];
  onChange: (next: SelectedConcept[]) => void;
  disabled?: boolean;
};

function extractCodeFromMappingDisplay(mappingDisplay: string, systemPrefix: string) {
  const raw = (mappingDisplay ?? '').trim();
  const prefix = `${systemPrefix}:`;
  if (!raw.startsWith(prefix)) return undefined;

  const remainder = raw.slice(prefix.length).trim();
  if (!remainder) return undefined;

  const token = remainder.split(' ')[0]?.split('(')[0]?.trim();
  return token || undefined;
}

function getCodes(concept: ConceptSummary) {
  const mappings = concept.mappings ?? [];
  let cielCode: string | undefined;
  let icd10Code: string | undefined;

  for (const m of mappings) {
    const disp = m?.display ?? '';
    if (!cielCode) cielCode = extractCodeFromMappingDisplay(disp, 'CIEL');
    if (!icd10Code) icd10Code = extractCodeFromMappingDisplay(disp, 'ICD-10-WHO');
    if (cielCode && icd10Code) break;
  }

  return { cielCode, icd10Code };
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

function itemToString(c: ConceptSummary | null) {
  if (!c) return '';
  const { cielCode, icd10Code } = getCodes(c);

  const bits: string[] = [];
  if (cielCode) bits.push(`CIEL:${cielCode}`);
  if (icd10Code) bits.push(`ICD-10:${icd10Code}`);
  if (c.conceptClass?.name) bits.push(c.conceptClass.name);

  return bits.length ? `${c.display} (${bits.join(', ')})` : c.display;
}

export default function ConceptSearchMultiSelect({
  id,
  labelText,
  placeholder = 'Type to search concepts...',
  helperText,
  value,
  onChange,
  disabled = false,
}: Props) {
  const [query, setQuery] = React.useState('');
  const { loading, results, error } = useConceptSearch(query);

  const addSelected = React.useCallback(
    (picked: ConceptSummary | null) => {
      if (!picked) return;

      const pickedSelected = toSelectedConcept(picked);

      const next = new Map<string, SelectedConcept>();
      for (const x of value ?? []) next.set(x.uuid, x);
      next.set(pickedSelected.uuid, pickedSelected);

      onChange(Array.from(next.values()));
      setQuery('');
    },
    [onChange, value],
  );

  const removeSelectedUuid = React.useCallback(
    (uuid: string) => {
      onChange((value ?? []).filter((x) => x.uuid !== uuid));
    },
    [onChange, value],
  );

  return (
    <div>
      <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{labelText}</div>
      {helperText ? (
        <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.75rem' }}>{helperText}</div>
      ) : null}

      <ComboBox
        id={`${id}-search`}
        titleText=""
        items={results ?? []}
        itemToString={itemToString}
        placeholder={placeholder}
        onInputChange={(text) => setQuery(String(text ?? ''))}
        onChange={(e: any) => addSelected(e?.selectedItem ?? null)}
        disabled={disabled}
        value={query}
      />

      <div style={{ marginTop: '0.5rem' }}>
        {loading ? <InlineLoading description="Searching…" /> : null}
        {!loading && error ? (
          <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-error, #da1e28)' }}>{error}</div>
        ) : null}
      </div>

      {value?.length ? (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {value.map((x) => (
            <Tag
              key={x.uuid}
              type="gray"
              filter
              onClose={() => removeSelectedUuid(x.uuid)}
              title={x.display}
            >
              {x.display}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
