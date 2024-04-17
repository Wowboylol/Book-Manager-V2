import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRatingGraphComponent } from './book-rating-graph/book-rating-graph.component';
import { TagUsageGraphComponent } from './tag-usage-graph/tag-usage-graph.component';
import { TagRatingGraphComponent } from './tag-rating-graph/tag-rating-graph.component';

@Component({
	selector: 'app-stats',
	standalone: true,
	imports: [CommonModule, BookRatingGraphComponent, TagUsageGraphComponent, TagRatingGraphComponent],
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css']
})
export class StatsComponent 
{
	constructor() { }
}
