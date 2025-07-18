import { FileDbVO, ItemVersionVO, Visibility } from "../model/inge";
import { Principal } from "../services/aa.service";

export const checkFileAccess = (file: FileDbVO, item: ItemVersionVO, principal: Principal): boolean => {
  //console.log(file.visibility === Visibility.PUBLIC)
  if(file && file.objectId && item && item.objectId) {
    return (
      file.visibility === Visibility.PUBLIC ||
      item.creator?.objectId === principal.user?.objectId ||
      principal.moderatorContexts?.some(mc => mc.objectId === item.context?.objectId)
    )
  }

  return false;
}

export const isUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

export const getFullItemId = (item: ItemVersionVO) => {
  return item.objectId + '_' + item.versionNumber;
}
