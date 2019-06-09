import { readable, writable } from "svelte/store"

export const selectedLists = writable([])
export const showNotion = writable(true)
export { cards, directories, lists } from "./db"
