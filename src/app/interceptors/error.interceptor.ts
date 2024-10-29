import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
    const router = inject(Router);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Erreur client: ${error.error.message}`;
            } else {
                switch (error.status) {
                    case 0:
                        errorMessage = 'Le serveur est inaccessible. Vérifiez votre connexion.';
                        break;
                    case 401:
                        errorMessage = 'Numéro de téléphone ou code incorrect';
                        break;
                    case 403:
                        errorMessage = 'Accès non autorisé';
                        router.navigate(['/login']);
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée';
                        break;
                    case 500:
                        errorMessage = 'Erreur serveur';
                        break;
                    default:
                        errorMessage = `Erreur ${error.status}: ${error.message}`;
                }
            }

            return throwError(() => ({ message: errorMessage, status: error.status }));
        })
    );
};