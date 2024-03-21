import { Route } from '@angular/router';

import { BooksComponent } from './books/books.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';

export const routes: Route[] = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    // { path: 'books', loadComponent: () => import('./books/books.component').then(mod => mod.BooksComponent) },
    { 
        path: 'books', 
        component: BooksComponent,
        children: [
            { 
                path: 'o', 
                component: OverlayComponent,
                children: [
                    { path: '', redirectTo: '/books', pathMatch: 'full' },
                    { path: ':id', component: BookDetailComponent }
                ]
            }
        ]
    },
];