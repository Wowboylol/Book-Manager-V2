import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

import { TagService } from 'src/app/shared/services/tag.service';
import { BookService } from 'src/app/shared/services/book.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Book } from 'src/app/shared/models/book.model';
import { Tag } from 'src/app/shared/models/tag.model';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';

@Component({
	selector: 'app-tag-rating-graph',
	standalone: true,
	imports: [CommonModule, TooltipDirective],
	templateUrl: './tag-rating-graph.component.html',
	styleUrls: ['./tag-rating-graph.component.css']
})
export class TagRatingGraphComponent implements OnInit, OnDestroy 
{
	// Component data
	private bookSubscription: Subscription;
	private themeSubscription: Subscription;
	tagRatingChart: Chart;
	isDisplayingQuery: boolean = false;
	queryValue: string = '';
	validQuery: boolean = false;

	// Graph data
	chosenTag: string = '';
	totalTagged: number = 0;
	averageRating: number = 0;
	tagValue: number = 0;
	starRatings: number[] = [0, 0, 0, 0, 0, 0];

	constructor(
		private tagService: TagService, 
		private bookService: BookService, 
		private themeService: ThemeService
	) { }

	ngOnInit(): void { 
		Chart.register(...registerables);
		this.createChart();
		this.changeChartTheme(this.themeService.isDarkMode());

		this.bookSubscription = this.bookService.booksChanged
			.subscribe(() => {
				if(this.isDisplayingQuery) { 
					this.updateData(this.bookService.getBooksByTag(this.chosenTag)); 
					this.updateChart();
				}
			}
		);

		this.themeSubscription = this.themeService.themeChanged
			.subscribe((isDarkMode: boolean) => {
				this.changeChartTheme(isDarkMode);
			}
		);
	}

	ngOnDestroy(): void { 
		this.tagRatingChart.destroy();
		this.bookSubscription.unsubscribe();
		this.themeSubscription.unsubscribe();
	}

	get allTags(): Tag[] {
		return this.tagService.getAllTags();
	}

	onSubmit(): void {
		this.chosenTag = this.queryValue.toLowerCase();
		this.updateData(this.bookService.getBooksByTag(this.chosenTag));
		this.updateChart();
		this.isDisplayingQuery = true;
	}

	isValidTag(event: Event): void {
		this.queryValue = (event.target as HTMLInputElement).value;
		if(!this.queryValue) { this.validQuery = false;}
		else { this.validQuery = this.tagService.tagExists(this.queryValue); }
	}

	private updateData(booksWithTag: Book[]): void {
		this.starRatings = [0, 0, 0, 0, 0, 0];
		this.totalTagged = booksWithTag.length;
		booksWithTag.forEach(book => this.starRatings[book.rating]++);

		if(this.totalTagged == 0) { 
			this.averageRating = 0;
			this.tagValue = 0;
		}
		else {
			this.averageRating = Math.round(booksWithTag.reduce((accumulator, book) => accumulator + book.rating, 0) / this.totalTagged * 100) / 100;

			// Find books without the chosen tag
			let books = this.bookService.getAllBooks();
			let booksWithoutTag = books.filter(book => book.tags.map(tag => tag.toLowerCase()).includes(this.chosenTag) === false);
			let excludedTotalRating = booksWithoutTag.reduce((accumulator, book) => accumulator + book.rating, 0);
			this.tagValue = Math.round((this.averageRating - (excludedTotalRating / (books.length - this.totalTagged))) * 100) / 100;
		}
	}

	private createChart(): void {
		this.tagRatingChart = new Chart('tag-rating-chart', {
			type: 'bar',
			data: {
				labels: ['0 Star', '1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
				datasets: [{
					label: 'Number of Books',
					data: [
						this.starRatings[0], 
						this.starRatings[1], 
						this.starRatings[2], 
						this.starRatings[3], 
						this.starRatings[4], 
						this.starRatings[5]
					],
					backgroundColor: [
						'rgba(159, 143, 239, 0.35)'
					],
					borderColor: [
						'rgba(159, 143, 239, 1)'
					],
					borderWidth: 2
				}]
			},
			options: {
				scales: {
					y: {
						title: {
							display: true,
							text: 'Number of Books'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Book Rating'
						}
					}
				},
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Choose a Tag to View Rating Distribution'
					}
				}
			}
		});
	}

	private updateChart(): void {
		this.tagRatingChart.data.datasets[0].data = [
			this.starRatings[0], 
			this.starRatings[1], 
			this.starRatings[2], 
			this.starRatings[3], 
			this.starRatings[4], 
			this.starRatings[5]
		];
		this.tagRatingChart.options.plugins.title.text = 'Number of Books by Rating With Tag "' + this.chosenTag + '"';
		this.tagRatingChart.update();
	}

	private changeChartTheme(isDarkMode: boolean): void {
		let color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
		this.tagRatingChart.options.scales.x.grid.color = color;
		this.tagRatingChart.options.scales.y.grid.color = color;
		this.tagRatingChart.update();
	}
}
