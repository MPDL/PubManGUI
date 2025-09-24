import { Injectable, resource, signal } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { firstValueFrom, Observable } from 'rxjs';
import { MdsPublicationGenre } from 'src/app/model/inge';

const ipListPath = 'getIpList';
const genrePropertiesPath = 'getGenreProperties';
const aiPersonNamePath = 'callAiApi';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService extends PubmanGenericRestClientService<any> {

  genre_types = Object.keys(MdsPublicationGenre);

  // Can and will be set by connected Components
  public selectedGenre = signal('ARTICLE');
  public genreSpecficProperties = signal<GenrePresentationObject>({} as GenrePresentationObject);

  public genrePropertiesResource = resource({
    params: () => this.selectedGenre(),
    loader: async ({ params })  => {
      const response = await firstValueFrom(this.getGenreProperties(params));
      const data: GenrePresentationObject = await response;
      console.log("genrespecific", data)
      return data
    },
  });

  constructor() {
    super('/miscellaneous');
    for (var i = 0; i < this.genre_types.length; i++) {
      let genre = this.genre_types.at(i);
      if (genre) {
        this.getGenreProperties(genre).subscribe(genreJson => {
          if (genreJson.genre == 'ARTICLE') {
            this.genreSpecficProperties.set(genreJson as GenrePresentationObject);
          }
        });
      }
    }
  }


  getGenreProperties(genre: string): Observable<GenrePresentationObject> {
    return this.httpGet(this.subPath + '/' + genrePropertiesPath + '?genre=' + genre);
  }

  getDecodedMultiplePersons(multiplePersonNameString: string): Observable<PersonName[]>{
      return this.httpPostJson(this.subPath + '/' + aiPersonNamePath, multiplePersonNameString);
  }

  retrieveIpList(): Observable<IpEntry[]> {
    return this.httpGet(this.subPath + '/' + ipListPath);
  }

}

export interface IpEntry {
  name: string,
  id: string,
  ipRanges: string[];
}

export interface PersonName {
  given: string;
  family: string;
}


export interface GenrePresentationObject {
  genre: string;
  properties: GenrePresentationObjectProperties;
}

export interface GenrePresentationObjectProperty {
  repeatable: boolean;
  display: boolean;
  optional: boolean;
}

export interface GenrePresentationObjectProperties {
  content: GenrePresentationObjectProperty;
  content_item_abstract: GenrePresentationObjectProperty;
  content_item_subject: GenrePresentationObjectProperty;
  content_item_subject_item_subject_type: GenrePresentationObjectProperty;
  content_item_subject_item_subject_value: GenrePresentationObjectProperty;
  creator_person_organization: GenrePresentationObjectProperty;
  creator_person_organization_creator: GenrePresentationObjectProperty;
  creator_person_organization_creator_organizations: GenrePresentationObjectProperty;
  creator_person_organization_creator_organizations_organization_address: GenrePresentationObjectProperty;
  creator_person_organization_creator_organizations_organization_identifier_type: GenrePresentationObjectProperty;
  creator_person_organization_creator_organizations_organization_identifier_value: GenrePresentationObjectProperty;
  creator_person_organization_creator_organizations_organization_name: GenrePresentationObjectProperty;
  creator_person_organization_creator_persons: GenrePresentationObjectProperty;
  creator_person_organization_creator_persons_person_family_name: GenrePresentationObjectProperty;
  creator_person_organization_creator_persons_person_given_name: GenrePresentationObjectProperty;
  creator_person_organization_creator_persons_person_identifier_type: GenrePresentationObjectProperty;
  creator_person_organization_creator_persons_person_identifier_value: GenrePresentationObjectProperty;
  creator_person_organization_creator_select_roles: GenrePresentationObjectProperty;
  creator_person_organization_creator_select_roles_creator_type: GenrePresentationObjectProperty;
  details: GenrePresentationObjectProperty;
  details_identifiers: GenrePresentationObjectProperty;
  details_identifiers_item_identifier_type: GenrePresentationObjectProperty;
  details_identifiers_item_identifier_value: GenrePresentationObjectProperty;
  details_item_degree: GenrePresentationObjectProperty;
  details_item_degree_item_degree: GenrePresentationObjectProperty;
  details_item_details_dates: GenrePresentationObjectProperty;
  details_item_details_dates_item_date_accepted: GenrePresentationObjectProperty;
  details_item_details_dates_item_date_created: GenrePresentationObjectProperty;
  details_item_details_dates_item_date_issued: GenrePresentationObjectProperty;
  details_item_details_dates_item_date_modified: GenrePresentationObjectProperty;
  details_item_details_dates_item_date_submitted: GenrePresentationObjectProperty;
  details_item_details_dates_item_published_online: GenrePresentationObjectProperty;
  details_item_language: GenrePresentationObjectProperty;
  details_item_language_item_language: GenrePresentationObjectProperty;
  details_item_toc: GenrePresentationObjectProperty;
  details_item_toc_item_table_of_contents: GenrePresentationObjectProperty;
  details_publishing_info: GenrePresentationObjectProperty;
  details_publishing_info_publishing_info_edition: GenrePresentationObjectProperty;
  details_publishing_info_publishing_info_place: GenrePresentationObjectProperty;
  details_publishing_info_publishing_info_publisher: GenrePresentationObjectProperty;
  details_review_method: GenrePresentationObjectProperty;
  details_review_method_item_review_method: GenrePresentationObjectProperty;
  details_total_number_of_pages: GenrePresentationObjectProperty;
  details_total_number_of_pages_item_total_number_of_pages: GenrePresentationObjectProperty;
  events: GenrePresentationObjectProperty;
  events_event_end_date: GenrePresentationObjectProperty;
  events_event_invitation_status: GenrePresentationObjectProperty;
  events_event_place: GenrePresentationObjectProperty;
  events_event_start_date: GenrePresentationObjectProperty;
  events_event_title: GenrePresentationObjectProperty;
  files: GenrePresentationObjectProperty;
  files_component_content: GenrePresentationObjectProperty;
  files_component_content_category: GenrePresentationObjectProperty;
  files_component_description: GenrePresentationObjectProperty;
  files_component_name: GenrePresentationObjectProperty;
  files_component_visibility: GenrePresentationObjectProperty;
  item_basic: GenrePresentationObjectProperty;
  item_basic_item_genre: GenrePresentationObjectProperty;
  item_basic_item_title: GenrePresentationObjectProperty;
  item_basic_item_title_alternative: GenrePresentationObjectProperty;
  legal_case: GenrePresentationObjectProperty;
  legal_case_legal_case_court_name: GenrePresentationObjectProperty;
  legal_case_legal_case_date_published: GenrePresentationObjectProperty;
  legal_case_legal_case_identifier: GenrePresentationObjectProperty;
  legal_case_legal_case_title: GenrePresentationObjectProperty;
  locators: GenrePresentationObjectProperty;
  locators_component_content_category: GenrePresentationObjectProperty;
  locators_component_description: GenrePresentationObjectProperty;
  locators_component_name: GenrePresentationObjectProperty;
  locators_component_visibility: GenrePresentationObjectProperty;
  project_info: GenrePresentationObjectProperty;
  project_info_funding_info: GenrePresentationObjectProperty;
  project_info_funding_info_organization_id: GenrePresentationObjectProperty;
  project_info_funding_info_organization_title: GenrePresentationObjectProperty;
  project_info_funding_info_program_id: GenrePresentationObjectProperty;
  project_info_funding_info_program_title: GenrePresentationObjectProperty;
  project_info_grant_id: GenrePresentationObjectProperty;
  project_info_title: GenrePresentationObjectProperty;
  sources: GenrePresentationObjectProperty;
  sources_source_basic: GenrePresentationObjectProperty;
  sources_source_basic_source_genre: GenrePresentationObjectProperty;
  sources_source_basic_source_title: GenrePresentationObjectProperty;
  sources_source_basic_source_title_alternative: GenrePresentationObjectProperty;
  sources_source_basic_source_title_alternative_source_title_alternative_type: GenrePresentationObjectProperty;
  sources_source_basic_source_title_alternative_source_title_alternative_value: GenrePresentationObjectProperty;
  sources_source_identifiers: GenrePresentationObjectProperty;
  sources_source_identifiers_source_identifier_type: GenrePresentationObjectProperty;
  sources_source_identifiers_source_identifier_value: GenrePresentationObjectProperty;
  sources_source_person_organization: GenrePresentationObjectProperty;
  sources_source_person_organization_select_roles: GenrePresentationObjectProperty;
  sources_source_person_organization_select_roles_creator_type: GenrePresentationObjectProperty;
  sources_source_person_organization_source_organizations: GenrePresentationObjectProperty;
  sources_source_person_organization_source_organizations_organization_address: GenrePresentationObjectProperty;
  sources_source_person_organization_source_organizations_organization_identifier_type: GenrePresentationObjectProperty;
  sources_source_person_organization_source_organizations_organization_identifier_value: GenrePresentationObjectProperty;
  sources_source_person_organization_source_organizations_organization_name: GenrePresentationObjectProperty;
  sources_source_person_organization_source_persons: GenrePresentationObjectProperty;
  sources_source_person_organization_source_persons_person_family_name: GenrePresentationObjectProperty;
  sources_source_person_organization_source_persons_person_given_name: GenrePresentationObjectProperty;
  sources_source_person_organization_source_persons_person_identifier_type: GenrePresentationObjectProperty;
  sources_source_person_organization_source_persons_person_identifier_value: GenrePresentationObjectProperty;
  sources_source_publishing_info: GenrePresentationObjectProperty;
  sources_source_publishing_info_publishing_info_edition: GenrePresentationObjectProperty;
  sources_source_publishing_info_publishing_info_place: GenrePresentationObjectProperty;
  sources_source_publishing_info_publishing_info_publisher: GenrePresentationObjectProperty;
  sources_source_sequence_number: GenrePresentationObjectProperty;
  sources_source_sequence_number_source_sequence_number: GenrePresentationObjectProperty;
  sources_source_total_number_of_pages: GenrePresentationObjectProperty;
  sources_source_total_number_of_pages_source_total_number_of_pages: GenrePresentationObjectProperty;
  sources_source_volume_issue_pages: GenrePresentationObjectProperty;
  sources_source_volume_issue_pages_source_end_page: GenrePresentationObjectProperty;
  sources_source_volume_issue_pages_source_issue: GenrePresentationObjectProperty;
  sources_source_volume_issue_pages_source_start_page: GenrePresentationObjectProperty;
  sources_source_volume_issue_pages_source_volume: GenrePresentationObjectProperty;
}
