import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { canDeactivateCreateWish } from './guards/can-deactivate-create-wish.guard';

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
                path: 'wish/:id/edit',
                loadComponent: () =>
                    import('./pages/edit-wish-page/edit-wish-page.component').then(
                        (m) => m.EditWishPageComponent
                    )
            },
            {
                path: 'create-wish',
                loadComponent: () =>
                    import('./pages/create-wish-page/create-wish-page.component').then(
                        (m) => m.CreateWishPageComponent
                    ),
                canDeactivate: [canDeactivateCreateWish]
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
