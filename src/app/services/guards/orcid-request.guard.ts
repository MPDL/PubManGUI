import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginComponent } from 'src/app/components/aa/login/login.component';

export const orcidRequestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const aaService = inject(AaService);
  const messageService = inject(MessageService);
  const translateService = inject(TranslateService);
  const modalService = inject(NgbModal);

  if (aaService.hasOrcidRequestPermission()) {
    return true;
  }

  if (!aaService.isLoggedIn) {
    const loginCompRef: NgbModalRef = modalService.open(LoginComponent, { backdrop: 'static' });
    return loginCompRef.dismissed.pipe(
      map((dismissReason: string) => dismissReason === 'login_success' && aaService.hasOrcidRequestPermission()),
      tap((accessGranted: boolean) => {
        if (!accessGranted) {
          if (aaService.isLoggedIn) {
            messageService.warning(translateService.instant('backendErrors.PERMISSION_DENIED'), true);
          }
          router.navigate(['/']);
        }
      })
    );
  }

  messageService.warning(translateService.instant('backendErrors.PERMISSION_DENIED'), true);
  router.navigate(['/']);
  return false;
};
