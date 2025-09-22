import { openDB } from "idb";
import type { Page } from "../stores/usePageStore"; // import interface bạn đã có

const DB_NAME = "apple-store";
const STORE_NAME = "pages";

export async function getDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

export async function savePages(pages: Page[]) {
    const db = await getDB();
    await db.put(STORE_NAME, pages, "page-store");
}

export async function loadPages(): Promise<Page[] | []> {
    const db = await getDB();
    return (await db.get(STORE_NAME, "page-store")) || [];
}

export async function clearPages() {
    const db = await getDB();
    await db.delete(STORE_NAME, "page-store");
}
