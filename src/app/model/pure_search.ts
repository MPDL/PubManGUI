import {
  date_query,
  genre_filter,
  ou_id_query,
  ou_name_query,
  person_id_query,
  person_name_query,
  title_query
} from "./pure_queries";

// interface fake_enum extends Record<string, any> { }

export interface bool_query {
  bool: {
    [key: string]: any
  }
}

export const search_criterion = {
  join: 'AND',
  filter: null,
  sub_filter: null
}

export const bracketed_search_criterion = {
  join: 'OR',
  filter: null,
  sub_filter: null,
  first_in_brackets: true
}

export const join_enum: Record<string, any> = {
  AND: 'must',
  OR: 'should',
  MOT: 'must_not',
} as const;

export const fieldOptions = [
  { label: 'Title', query: title_query },
  { label: 'Person', query: person_id_query, alt_query: person_name_query },
  { label: 'Organization', query: ou_id_query, alt_query: ou_name_query },
  { label: 'Identifier', query: 'String' },
  { label: 'Date', query: date_query },
  { label: 'Genre', query: genre_filter },
];
