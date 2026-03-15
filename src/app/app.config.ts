import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

function initTranslations(translate: TranslateService): () => Promise<unknown> {
    return () => {
        const lang = localStorage.getItem('ascend-locale') === 'ru' ? 'ru' : 'en';
        translate.setDefaultLang('en');
        return firstValueFrom(translate.use(lang));
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(),
        provideTranslateService({ fallbackLang: 'en' }),
        provideTranslateHttpLoader({ prefix: 'assets/i18n/', suffix: '.json' }),
        {
            provide: APP_INITIALIZER,
            useFactory: initTranslations,
            deps: [TranslateService],
            multi: true
        }
    ]
};
