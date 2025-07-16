import { elasticSearchFields, ElasticSearchIndexField } from "./mapping-utils";


export const escapeForQueryString = (escapeMe: string) : string  => {
  let result = escapeMe.replace("\\", "\\\\");
  result = result.replace("=", "\\=");
  result = result.replace("|", "\\|");
  result = result.replace("(", "\\(");
  result = result.replace(")", "\\)");
  result = result.replace("\"", "\\\"");
  return result;
}

export const unescapeForQueryString = (escapeMe: string): string => {
  let result = escapeMe.replace("\\=", "=");
  result = result.replace("\\\"", "\"");
  result = result.replace("\\|", "|");
  result = result.replace("\\(", "(");
  result = result.replace("\\)", ")");
  result = result.replace("\\\\", "\\");
  return result;
}
export const baseElasticSearchQueryBuilder = (indexFields : string | string[], searchValue: string | string[]) :Object => {

  const searchValueArray: string[] = Array.isArray(searchValue) ? searchValue : [searchValue];

  if (Array.isArray(indexFields) && indexFields.length > 1) {

    let shouldQueries = indexFields.map(index => baseElasticSearchQueryBuilderInt(index, searchValueArray));
    return {bool: {should:shouldQueries}};

  } else {

    if(Array.isArray(indexFields)) {
      return baseElasticSearchQueryBuilderInt(indexFields[0], searchValueArray);
    }
    else {
      return baseElasticSearchQueryBuilderInt(indexFields, searchValueArray);
    }


  }
}


const baseElasticSearchQueryBuilderInt = (indexField : string, searchValue: string[]) : Object  => {

  const ef: ElasticSearchIndexField = elasticSearchFields[indexField];

  if(!ef) {
    throw new Error("No index field " + indexField + " found in elasticsearch mapping")
  }

  switch(ef.type) {
    case "text" : {
      if(searchValue.length == 1) {
        return checkMatchOrPhraseOrWildcardMatch(indexField, searchValue[0]);
      }
      else {
        let queries = searchValue.map(s => checkMatchOrPhraseOrWildcardMatch(indexField, s));
        return {bool:{should:queries}};
      }

    }
    default : {
      if(searchValue.length == 1) {
        return {term: {[indexField] : searchValue[0]}};
      }
      else {
        return {terms:{[indexField]: searchValue}};
      }
    }
  }

}

const checkMatchOrPhraseOrWildcardMatch = (indexField:string, searchString: string):  Object =>  {
  if (searchString && searchString.trim().startsWith("\"") && searchString.trim().endsWith("\"")) {
    return {match_phrase : {[indexField] : searchString.trim().substring(1, searchString.length - 1)}};
    //return MatchPhraseQuery.of(mp => mp.field(index).query(searchString.trim().substring(1, searchString.length() - 1)))._toQuery();
  } else if (searchString !== null && searchString.includes("*")) {
    return {wildcard : {[indexField.concat(".keyword")] : {value : searchString}}};
    //return WildcardQuery.of(wq => wq.field(index + ".keyword").value(searchString))._toQuery();
  } else {
    return {match : {[indexField] : {query : searchString, operator: "AND"}}}
    //return MatchQuery.of(i => i.field(index).query(searchString).operator(Operator.And))._toQuery();
  }
}

export const baseElasticSearchSortBuilder = (indexField: string, order: string):  Object => {

  const ef: ElasticSearchIndexField = elasticSearchFields[indexField];
  let finalIndexField = indexField;

  if (indexField==='_score' || indexField==='_doc') {
    return {[finalIndexField] : {order: order}};
  }

  if (!ef) {
    throw new Error("No index field " + indexField + " found in elasticsearch mapping")
  }

  switch (ef.type) {
    case "text": {
      finalIndexField += ".keyword";
      break;
    }

    default:
  }

  let  nestedPaths: string[] | undefined = ef.nestedPaths;

  if (!nestedPaths) {
    return {[finalIndexField] : {order: order}};
    //fieldSort = FieldSort.of(fs => fs.field(finalIndexField).order(order));
  } else {
    return {[finalIndexField] : {order: order, nested: {path: nestedPaths.join(".")}}};
    //let  nestedSortValue: NestedSortValue = NestedSortValue.of(nsv => nsv.path(java.lang.String.join(".", nestedPaths)));
    //fieldSort = FieldSort.of(fs => fs.field(finalIndexField).order(order).nested(nestedSortValue));
  }

  //return fieldSort;
}


export const buildDateRangeQuery = (index: string, from: string, to: string) => {
  return {
    range: {
      [index]: {
        ...from && from.trim() !== "" && {gte: roundDateString(from)},
        ...to && to.trim() !== "" && {lte: roundDateString(to)}

      }
    }
  }
}

const roundDateString = (toQuery: string) => {
  if (!toQuery) {
    return undefined;
  } else if (toQuery.match(/^\d\d\d\d$/)) {
    return toQuery + "||/y";
  } else if (toQuery.match(/^\d\d\d\d-\d\d$/)) {
    return toQuery + "||/M";
  } else if (toQuery.match(/^\d\d\d\d-\d\d-\d\d$/)) {
    return toQuery + "||/d";
  }

  return toQuery;


}


