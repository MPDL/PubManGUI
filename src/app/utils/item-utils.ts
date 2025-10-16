import { CreatorVO, FileDbVO, ItemVersionVO, OrganizationVO, PersonVO, Visibility } from "../model/inge";
import { Principal } from "../services/aa.service";
import { isFormValueEmpty } from "./utils";
import { environment } from "../../environments/environment";

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

export const isEmptyCreator = (creator?: CreatorVO) => {
  return isEmptyPerson(creator?.person) && isEmptyOrg(creator?.organization);
}

const isEmptyPerson = (person: PersonVO | undefined) => {
  return isFormValueEmpty(person?.familyName) && isFormValueEmpty(person?.givenName) && isFormValueEmpty(person?.identifier?.id);

}

const isEmptyOrg = (org: OrganizationVO | undefined) => {
  return isFormValueEmpty(org?.name) && isFormValueEmpty(org?.address) && isFormValueEmpty(org?.identifier);
}

export const getUrlForFile = (file: FileDbVO | undefined)=> {
  if(file && file.content)
  {
    return environment.inge_uri + file.content
  }
  return undefined;
}

export const getThumbnailUrlForFile = (file: FileDbVO | undefined)=> {
  return getUrlForFile(file)?.replace('/content', '/thumbnail')
}


