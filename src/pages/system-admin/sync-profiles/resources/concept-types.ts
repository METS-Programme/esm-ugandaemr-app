export type ConceptMappingSummary = {
  source: string;
  code: string;
  mapType?: string;
  display: string;
};

export type ConceptSummary = {
  uuid: string;
  display: string;
  id?: number;
  conceptClass?: { uuid: string; name: string };
  datatype?: { uuid: string; name: string };
  mappings: ConceptMappingSummary[];
};

export type SelectedConcept = {
  uuid: string;
  display: string;
  id?: number;
  conceptClass?: string;
  datatype?: string;
};
