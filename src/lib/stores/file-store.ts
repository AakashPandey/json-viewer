import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store'

export const fileSelectTrigger = writable(0);
export const fileName = writable('');
export const fileSize = writable(0);
export const jsonData = writable(<any>[]);

export const reviewOfListing = persisted('review_of','');
export const reviewList = persisted('reviews',<any>[]);