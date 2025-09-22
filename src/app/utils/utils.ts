import { IdType, ItemVersionRO } from "../model/inge";

const reParamSplit = /\s*;\s*/
const reHeaderSplit = /\s*:\s*/
const rePropertySplit = /\s*=\s*(.+)/
const reEncodingSplit = /\s*'[^']*'\s*(.*)/
const reQuotesTrim = /(?:^["'\s]*)|(?:["'\s]*$)/g

const isFormValueEmpty = (value: any) => {
  return value === null || value === undefined || value === '' || value === '0: null' || ((typeof value === 'string') && value.trim().length === 0)
}

const versionIdToObjectId = (id: string): string => {
    return id.substring(0, id.lastIndexOf('_'));
}

const itemToVersionId = (item: ItemVersionRO): string => {
  return item.objectId + '_' + item.versionNumber;
}

const contentDispositionParser = (data: string | null) => {
  if (!(data && typeof data === 'string')) {
    return
  }
  const headerSplit = data.split(reParamSplit)
    .map(item => item.trim())
    .filter(item => !!item)

  let type = headerSplit.shift()
  if (!type) {
    return
  }
  const types = type.toLowerCase().split(reHeaderSplit)
  type = types[1] || types[0]

  return headerSplit
    .map(prop => prop.split(rePropertySplit))
    .reduce((o: {[key:string] : any}, [key, value]) => {
      if (!value) {
        o[key] = true
      } else if (key.slice(-1) === '*') {
        let encoding
        [encoding, value] = value.split(reEncodingSplit)
        if (value) {
          try {
            value = decodeURIComponent(value)
          } catch (e) { }
          o[key.slice(0, -1).toLowerCase()] = value
        }
        o['encoding'] = encoding.toLowerCase()
      } else if (!(key in o)) {
        o[key.toLowerCase()] = value.replace(reQuotesTrim, '')
      }
      return o
    }, { type })
}

export const humanFileSize = (bytes: number): `${number} ${'B' | 'KB' | 'MB' | 'GB' | 'TB'}` => {
  if(!bytes || bytes === 0) return '0 B';
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Number((bytes / Math.pow(1024, index)).toFixed(2)) * 1} ${(['B', 'KB', 'MB', 'GB', 'TB'] as const)[index]}`;
};

export const identifierUriToEnum = (idUri: string): IdType | undefined => {
  if(idUri) {
    const val = idUri.substring(idUri.lastIndexOf('/')+1, idUri.length);

    return (<any>IdType)[val];
  }
  return undefined;
}

export const removeDuplicates = (array: any[], key: any) => {
  return array.reduce((arr, item) => {
    const removed = arr.filter((i:any) => i[key] !== item[key]);
    return [...removed, item];
  }, []);
};

export {
  contentDispositionParser,
  versionIdToObjectId,
  itemToVersionId,
  isFormValueEmpty
}
