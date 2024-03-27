import { Pipe, PipeTransform } from '@angular/core';

import { Book } from '../models/book.model';
import { BookSearchQuery } from '../models/book-search-query.model';

enum SearchType { Name, Tag, Collection }
enum SearchSort { DateAdded, DateUpdated, Alphabetical, Rating }
enum SearchOrder { Descending, Ascending }

@Pipe({
  name: 'bookSearch',
  standalone: true
})
export class BookSearchPipe implements PipeTransform 
{
	transform(value: Book[], searchQuery: BookSearchQuery, searchCount): Book[] 
	{
		// Filter and sort the search result based on the search query
		// We copy the array to avoid modifying the original array and its values
		var copy = value.slice();
		var searchResult: Book[] = this.filterSearch(copy, searchQuery.searchString, searchQuery.searchType);
		searchResult = this.sortSearch(searchResult, searchQuery.searchSort, searchQuery.searchOrder);

		// Update pointer to search count with the number of search results
		searchCount.value = searchResult.length;
		return searchResult;
	}

	// Filter the search result based on the search type and search string
	private filterSearch(value: Book[], searchString: string, searchType: number): Book[]
	{
		if(searchString == null || searchString == "") {
			return value;
		}

		try {
			switch(searchType)
			{
				case SearchType.Name: {
					return value.filter(book => book.name.toLowerCase().includes(searchString.toLowerCase()));
				}
				case SearchType.Tag: {
					// FIXME: This is a placeholder implementation
					return value.filter(book => book.tags.includes(searchString));
				}
				case SearchType.Collection: {
					return value.filter(book => book.collection.toLowerCase().includes(searchString.toLowerCase()));
				}
				default: {
					throw new Error("Invalid search type");
				}
			}
		}
		catch(e) {
			console.error(e);
			return value;
		}
	}

	// Sort the search result based on the search sort and search order
	private sortSearch(value: Book[], searchSort: number, searchOrder: number): Book[]
	{
		try {
			if(searchOrder != SearchOrder.Ascending && searchOrder != SearchOrder.Descending) {
				throw new Error("Invalid search order");
			}
		
			switch(searchSort)
			{
				case SearchSort.DateAdded: {
					return searchOrder == SearchOrder.Ascending ? value : value.reverse();
				}
				case SearchSort.DateUpdated: {
					return searchOrder == SearchOrder.Ascending ? 
						value.sort((book1, book2) => {
							if(book1.dateUpdated == book2.dateUpdated) { return book1.id - book2.id; }
							return +book1.dateUpdated - +book2.dateUpdated;
						}) :
						value.sort((book1, book2) => {
							if(book1.dateUpdated == book2.dateUpdated) { return book2.id - book1.id; }
							return +book2.dateUpdated - +book1.dateUpdated;
						});
				}
				case SearchSort.Alphabetical: {
					return searchOrder == SearchOrder.Ascending ?
						value.sort((book1, book2) => book1.name.localeCompare(book2.name)) :
						value.sort((book1, book2) => book2.name.localeCompare(book1.name));
				}
				case SearchSort.Rating: {
					return searchOrder == SearchOrder.Ascending ?
						value.sort((book1, book2) => { 
							if(book1.rating == book2.rating) { return book2.id - book1.id; }
							return book1.rating - book2.rating;
						}) :
						value.sort((book1, book2) => {
							if(book1.rating == book2.rating) { return book2.id - book1.id; }
							return book2.rating - book1.rating;
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
