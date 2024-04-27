import { Route } from '@angular/router';

import { BooksComponent } from './books/books.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { TagsComponent } from './tags/tags.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { AuthComponent } from './auth/auth.component';
import { StatsComponent } from './stats/stats.component';
import { CollectionsComponent } from './collections/collections.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Route[] = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    // { path: 'books', loadComponent: () => import('./books/books.component').then(mod => mod.BooksComponent) },
    { 
        path: 'books', 
        component: BooksComponent,
        canActivate: [AuthGuard],
        children: [
            { 
                path: 'o', 
                component: OverlayComponent,
                children: [
                    { path: '', redirectTo: '/books', pathMatch: 'full' },
                    { path: 'new', component: BookEditComponent },
                    { path: ':id', component: BookDetailComponent },
                    { path: ':id/edit', component: BookEditComponent }
                ]
            }
        ]
    },
    { path: 'collections', component: CollectionsComponent, canActivate: [AuthGuard]},
    { path: 'tags', component: TagsComponent, canActivate: [AuthGuard]},
    { path: 'stats', component: StatsComponent, canActivate: [AuthGuard]},
    { path: 'auth', component: AuthComponent }
];