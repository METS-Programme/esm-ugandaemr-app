import React from 'react';
import { ComboBox, InlineLoading, Tag } from '@carbon/react';

import { useEncounterTypeSearch } from './useEncounterTypeSearch';
import type { EncounterTypeReference } from '../sync-profiles.types';

type Props = {
  id: string;
  labelText: string;
  placeholder?: string;
  helperText?: string;
  value: EncounterTypeReference[];
  onChange: (next: EncounterTypeReference[]) => void;
  disabled?: boolean;
};

function itemToString(et: EncounterTypeReference | null) {
  if (!et) return '';
  return et.display;
}

export default function EncounterTypeSearchMultiSelect({
  id,
  labelText,
  placeholder = 'Type to search encounter types...',
  helperText,
  value,
  onChange,
  disabled = false,
}: Props) {
  const [query, setQuery] = React.useState('');
  const { loading, results, error } = useEncounterTypeSearch(query);

  const addSelected = React.useCallback(
    (picked: EncounterTypeReference | null) => {
      if (!picked) return;

      const next = new Map<string, EncounterTypeReference>();
      for (const x of value ?? []) next.set(x.uuid, x);
      next.set(picked.uuid, picked);

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
              type="blue"
              filter
              onClose={() => removeSelectedUuid(x.uuid)}
              title={x.description || x.display}
            >
              {x.display}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
