import { readable, writable } from "svelte/store"

export const selectedLists = writable([])
export const showNotion = writable(true)
export const selectedCard = writable(null)
export const selectedList = writable(null)
export { cards, directories, lists } from "./db"
