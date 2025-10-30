export interface GoogleBookResponse {
	items?: GoogleBookItem[]
	totalItems: number
}

export interface GoogleBookItem {
	id: string
	volumeInfo: {
		title: string
		authors?: string[]
		publishedDate?: string
		description?: string
		industryIdentifiers?: {
			type: string
			identifier: string
		}[]
		imageLinks?: {
			thumbnail?: string
			smallThumbnail?: string
		}
	}
}
