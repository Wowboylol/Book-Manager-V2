import { Route } from '@angular/router';
import { BooksComponent } from './books/books.component';

export const routes: Route[] = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    { path: 'books', component: BooksComponent },
];