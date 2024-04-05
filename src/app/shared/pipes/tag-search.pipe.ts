import { Pipe, PipeTransform } from '@angular/core';

import { Tag } from '../models/tag.model';
import { TagSearchQuery } from '../models/tag-search-query.model';

enum SearchSort { Alphabetical, UsageAmount, DateLastUsed }
enum SearchOrder { Descending, Ascending }

@Pipe({
	name: 'tagSearch',
	standalone: true
})
export class TagSearchPipe implements PipeTransform 
{
	transform(value: Tag[], searchQuery: TagSearchQuery, searchCount): Tag[] 
	{
		// Filter and sort the search result based on the search query
		// We copy the array to avoid modifying the original array and its values
		var copy = value.slice();
		var searchResult: Tag[] = this.filterSearch(copy, searchQuery.searchString);
		searchResult = this.sortSearch(searchResult, searchQuery.searchSort, searchQuery.searchOrder);

		// Update pointer to search count with the number of search results
		searchCount.value = searchResult.length;
		return searchResult;
	}

	// Filter the search result based on the search string
	private filterSearch(value: Tag[], searchString: string): Tag[]
	{
		if(searchString == null || searchString == "") {
			return value;
		}

		return value.filter(tag => tag.name.toLowerCase().includes(searchString.toLowerCase()));
	}

	// Sort the search result based on the search sort and search order
	private sortSearch(value: Tag[], searchSort: number, searchOrder: number): Tag[]
	{
		try {
			if(searchOrder != SearchOrder.Ascending && searchOrder != SearchOrder.Descending) {
				throw new Error("Invalid search order");
			}

			switch(searchSort)
			{
				case SearchSort.Alphabetical: {
					return searchOrder == SearchOrder.Ascending ?
						value.sort((tag1, tag2) => tag1.name.localeCompare(tag2.name)) :
						value.sort((tag1, tag2) => tag2.name.localeCompare(tag1.name));
				}
				case SearchSort.UsageAmount: {
					return searchOrder == SearchOrder.Ascending ?
						value.sort((tag1, tag2) => tag1.amount - tag2.amount) :
						value.sort((tag1, tag2) => tag2.amount - tag1.amount);
				}
				case SearchSort.DateLastUsed: {
					return searchOrder == SearchOrder.Ascending ? 
						value.sort((tag1, tag2) => {
							if(tag1.lastUsed == null) { return -1; }
							if(tag2.lastUsed == null) { return 1; }
							return +tag1.lastUsed - +tag2.lastUsed;
						}) :
						value.sort((tag1, tag2) => {
							if(tag1.lastUsed == null) { return 1; }
							if(tag2.lastUsed == null) { return -1; }
							return +tag2.lastUsed - +tag1.lastUsed;
						});
				}
				default: {
					throw new Error("Invalid search sort");
				}
			}
		}
		catch(e) {
			console.error(e);
			return value;
		}
	}
}
