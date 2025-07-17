import { Component, Input } from '@angular/core';
import { FileDbVO, ItemVersionVO, OA_STATUS, Storage, Visibility } from "../../../model/inge";
import { NgbPopover, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { environment } from 'src/environments/environment';
import { EmptyPipe } from "../../../shared/services/pipes/empty.pipe";
import { AaService } from "../../../services/aa.service";
import { checkFileAccess, getFullItemId, isUrl } from "../../../shared/services/item-utils";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { TranslatePipe } from "@ngx-translate/core";
import { CopyButtonDirective } from "../../../shared/directives/copy-button.directive";

@Component({
  selector: 'pure-item-view-file',
  standalone: true,
  imports: [
    NgbTooltip,
    EmptyPipe,
    NgbPopover,
    TranslatePipe,
    CopyButtonDirective
  ],
  templateUrl: './item-view-file.component.html',
  styleUrl: './item-view-file.component.scss'
})
export class ItemViewFileComponent {

  protected ingeUri = environment.inge_uri;
  @Input({required: true}) files: FileDbVO[] | undefined = [];
  @Input({required: true}) item!: ItemVersionVO;

  audienceInfos: Map<string, any> = new Map;

  constructor(private aaService: AaService, private itemsService: ItemsService) {
  }

  ngOnInit() {

    // Get authorization info for each AUDIENCE file
    this.files?.filter(f => f.visibility=== Visibility.AUDIENCE).forEach(f => {
      this.itemsService.retrieveFileAuthorizationInfo(getFullItemId(this.item), f.objectId).subscribe(authInfo => {
        this.audienceInfos.set(f.objectId, authInfo);
        //console.log(this.audienceInfos)
      })
    })
  }

  ipOrganizations(file: FileDbVO) {
    //console.log(JSON.stringify(this.audienceInfos))
    return Object.values(this.audienceInfos?.get(file.objectId)?.ipInfo || {});
  }

  fileAccessGranted(file: FileDbVO) {

    const genericFileAccess = checkFileAccess(file, this.item, this.aaService.principal.value);
    if(file.visibility=== Visibility.AUDIENCE) {
      const audienceAccess:boolean = this.audienceInfos?.get(file.objectId)?.actions?.READ_FILE || false;
      return genericFileAccess || audienceAccess;
    }
    return genericFileAccess;
  }

  oaStatusIcon(file: FileDbVO): string | undefined {
    if (file) {
      switch (file.metadata?.oaStatus) {
        //case OA_STATUS.CLOSED_ACCESS: return 'open_access_gold_64.png';
        case OA_STATUS.GOLD: return 'open_access_gold_64.png'
        case OA_STATUS.GREEN: return 'open_access_green_64.png'
        case OA_STATUS.HYBRID: return 'open_access_hybrid_64.png'
        case OA_STATUS.MISCELLANEOUS: return 'open_access_miscellaneous_64.png'
        case OA_STATUS.NOT_SPECIFIED: return 'open_access_not_specified_64.png'
        case undefined: return (file.visibility === Visibility.PUBLIC || file.storage === Storage.EXTERNAL_URL) ? 'open_access_not_specified_64.png' : undefined
        default: return undefined;
      }
    }
    return undefined;
  }

  protected readonly isUrl = isUrl;
}
