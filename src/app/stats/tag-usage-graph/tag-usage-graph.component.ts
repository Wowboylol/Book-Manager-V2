import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';

import { Tag } from 'src/app/shared/models/tag.model';
import { TagService } from 'src/app/shared/services/tag.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
	selector: 'app-tag-usage-graph',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag-usage-graph.component.html',
	styleUrls: ['./tag-usage-graph.component.css']
})
export class TagUsageGraphComponent implements OnInit, OnDestroy 
{
	// Component data
	private bookSubscription: Subscription;
	private themeSubscription: Subscription;
	tagUsageChart: Chart;

	// Graph data
	averageTagsPerBook: number = 0;
	topTags: Tag[] = [];

	constructor(
		private tagService: TagService,  
		private themeService: ThemeService, 
		private bookService: BookService
	) { }

	ngOnInit(): void 
	{ 
		Chart.register(...registerables);
		this.updateData(this.tagService.getAllTags());
		this.createChart();
		this.changeChartTheme(this.themeService.isDarkMode());

		// Use book subscription instead of tag subscription because books are updated after tags
		// Otherwise when calling getAllBooks() in updateData, it will be empty (only when user fetches on stat page)
		this.bookSubscription = this.bookService.booksChanged
			.subscribe(() => {
				this.updateData(this.tagService.getAllTags());
				this.updateChart();
			}
		);

		this.themeSubscription = this.themeService.themeChanged
			.subscribe((isDarkMode: boolean) => {
				this.changeChartTheme(isDarkMode);
			}
		);
	}

	ngOnDestroy(): void {
		this.tagUsageChart.destroy();
		this.bookSubscription.unsubscribe();
		this.themeSubscription.unsubscribe();
	}

	private updateData(tags: Tag[]): void {
		this.topTags = tags.sort((tag1, tag2) => tag2.amount - tag1.amount).slice(0, 10);
		if(this.topTags.length < 10) {
			for(let i = this.topTags.length; i < 10; i++) {
				this.topTags.push(new Tag('', 0, null));
			}
		}
		this.averageTagsPerBook = tags.length > 0 ? 
			Math.round(tags.reduce((accumulator, tag) => accumulator + tag.amount, 0) / this.bookService.getAllBooks().length * 100) / 100 : 0;
	}

	private createChart(): void {
		this.tagUsageChart = new Chart('tag-usage-chart', {
			type: 'bar',
			data: {
				labels: [
					this.topTags[0].name, this.topTags[1].name, 
					this.topTags[2].name, this.topTags[3].name, 
					this.topTags[4].name, this.topTags[5].name, 
					this.topTags[6].name, this.topTags[7].name, 
					this.topTags[8].name, this.topTags[9].name],
				datasets: [{
					label: 'Books Linked with Tag',
					data: [
						this.topTags[0].amount, this.topTags[1].amount,
						this.topTags[2].amount, this.topTags[3].amount,
						this.topTags[4].amount, this.topTags[5].amount,
						this.topTags[6].amount, this.topTags[7].amount,
						this.topTags[8].amount, this.topTags[9].amount
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
							text: 'Books Linked with Tag'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Tag Name'
						}
					}
				},
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Top 10 Most Used Tags'
					}
				}
			}
		});
	}

	private updateChart(): void {
		this.tagUsageChart.data.labels = [
			this.topTags[0].name, this.topTags[1].name,
			this.topTags[2].name, this.topTags[3].name,
			this.topTags[4].name, this.topTags[5].name,
			this.topTags[6].name, this.topTags[7].name,
			this.topTags[8].name, this.topTags[9].name
		];
		this.tagUsageChart.data.datasets[0].data = [
			this.topTags[0].amount, this.topTags[1].amount,
			this.topTags[2].amount, this.topTags[3].amount,
			this.topTags[4].amount, this.topTags[5].amount,
			this.topTags[6].amount, this.topTags[7].amount,
			this.topTags[8].amount, this.topTags[9].amount
		];
		this.tagUsageChart.update();
	}

	private changeChartTheme(isDarkMode: boolean): void {
		let color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
		this.tagUsageChart.options.scales.x.grid.color = color;
		this.tagUsageChart.options.scales.y.grid.color = color;
		this.tagUsageChart.update();
	}
}
