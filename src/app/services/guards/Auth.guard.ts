import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AaService } from 'src/app/services/aa.service';
import { inject } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';


export const AuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const aaSvc = inject(AaService);
  const msgSvc = inject(MessageService);

  if (aaSvc.principal.getValue().loggedIn) {
    return true;
  } else {
    msgSvc.warning(`Please, log in!\n`);
    msgSvc.dialog.afterAllClosed.subscribe(result => {
      router.navigate(['/home'])
    })
    return false;
  }
};
