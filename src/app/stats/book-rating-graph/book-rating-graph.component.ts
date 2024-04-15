import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';

import { BookService } from 'src/app/shared/services/book.service';
import { Book } from 'src/app/shared/models/book.model';

@Component({
	selector: 'app-book-rating-graph',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './book-rating-graph.component.html',
	styleUrls: ['./book-rating-graph.component.css']
})
export class BookRatingGraphComponent implements OnInit, OnDestroy 
{
	// Component data
	private bookSubscription: Subscription
	bookRatingChart: Chart;

	// Data
	totalBooks: number = 0;
	averageRating: number = 0;
	starRatings: number[] = [0, 0, 0, 0, 0, 0];

	constructor(private bookService: BookService) { }

	ngOnInit(): void 
	{ 
		Chart.register(...registerables);
		this.updateData(this.bookService.getAllBooks());
		this.createChart();

		this.bookSubscription = this.bookService.booksChanged
			.subscribe((books: Book[]) => {
				this.updateData(books);
				this.updateChart();
			}
		);
	}

	ngOnDestroy(): void {
		this.bookSubscription.unsubscribe();
	}

	private updateData(books: Book[]): void {
		this.starRatings = [0, 0, 0, 0, 0, 0];
		this.totalBooks = books.length;
		this.averageRating = this.totalBooks > 0 ? 
			Math.round(books.reduce((accumulator, book) => accumulator + book.rating, 0) / this.totalBooks * 100) / 100 : 
			0;

		books.forEach(book => {
			this.starRatings[book.rating]++;
		});
	}

	private createChart(): void {
		this.bookRatingChart = new Chart('book-rating-chart', {
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
						text: 'Number of Books by Rating'
					}
				}
			}
		});
	}

	public updateChart(): void {
		this.bookRatingChart.data.datasets[0].data = [
			this.starRatings[0], 
			this.starRatings[1], 
			this.starRatings[2], 
			this.starRatings[3], 
			this.starRatings[4], 
			this.starRatings[5]
		];
		this.bookRatingChart.update();
	}
}
