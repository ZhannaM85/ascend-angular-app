import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'wishes', pathMatch: 'full' },
            {
                path: 'wishes',
                loadComponent: () =>
                    import('./pages/wishes-page/wishes-page.component').then(
                        (m) => m.WishesPageComponent
                    )
            },
            {
                path: 'wish/:id',
                loadComponent: () =>
                    import('./pages/wish-details-page/wish-details-page.component').then(
                        (m) => m.WishDetailsPageComponent
                    )
            },
            {
                path: 'create-wish',
                loadComponent: () =>
                    import('./pages/create-wish-page/create-wish-page.component').then(
                        (m) => m.CreateWishPageComponent
                    )
            },
            {
                path: 'fulfilled',
                loadComponent: () =>
                    import('./pages/fulfilled-wishes-page/fulfilled-wishes-page.component').then(
                        (m) => m.FulfilledWishesPageComponent
                    )
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./pages/about-page/about-page.component').then(
                        (m) => m.AboutPageComponent
                    )
            }
        ]
    },
    { path: '**', redirectTo: 'wishes' }
];
