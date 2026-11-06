
import { API_ENDPOINTS } from "./apiConfig.js";

async function getData(endpoint, storageKey) {
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;

    } catch (error) {
        console.warn("Using local storage:", error);

        return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
}

async function addData(endpoint, storageKey, item) {
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error("Could not save");

        const savedItem = await response.json();
        const data = await getData(endpoint, storageKey);

        return savedItem;

    } catch (error) {
        const data = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const newItem = {
            ...item,
            id: "local-" + Date.now()
        };

        data.push(newItem);
        localStorage.setItem(storageKey, JSON.stringify(data));

        return newItem;
    }
}

async function deleteData(endpoint, storageKey, id) {
    try {
        const response = await fetch(`${endpoint}/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

    } catch (error) {
        console.warn("Deleting from local storage:", error);
    }

    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updated = data.filter(item => String(item.id) !== String(id));

    localStorage.setItem(storageKey, JSON.stringify(updated));
}

export const getPeriods = () =>
    getData(API_ENDPOINTS.periods, "tasknest_periods");

export const addPeriod = item =>
    addData(API_ENDPOINTS.periods, "tasknest_periods", item);

export const deletePeriod = id =>
    deleteData(API_ENDPOINTS.periods, "tasknest_periods", id);

export const getSymptoms = () =>
    getData(API_ENDPOINTS.symptoms, "tasknest_symptoms");

export const addSymptom = item =>
    addData(API_ENDPOINTS.symptoms, "tasknest_symptoms", item);

export const deleteSymptom = id =>
    deleteData(API_ENDPOINTS.symptoms, "tasknest_symptoms", id);
