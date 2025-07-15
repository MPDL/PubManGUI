import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";
import { MdsPublicationGenre } from "src/app/model/inge";

export const SourceRequiredValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const genre_types = MdsPublicationGenre;
  const error_types = Errors;
  const metadata = control;
  const genre = metadata.get('genre')?.value;
  if (genre === genre_types.ARTICLE || 
    genre === genre_types.BOOK_ITEM || 
    genre === genre_types.CONFERENCE_PAPER || 
    genre === genre_types.MAGAZINE_ARTICLE) {
      if ( metadata.get('sources')?.value.length < 1)  {
        return { [error_types.SOURCE_NOT_PROVIDED]: true };
      }
  }
  return null;
}
