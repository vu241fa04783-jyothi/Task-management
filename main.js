
import {
    getPeriods,
    addPeriod,
    deletePeriod,
    getSymptoms,
    addSymptom,
    deleteSymptom
} from "./cycleService.js";

let periods = [];
let symptoms = [];
let calendarDate = new Date();

const $ = id => document.getElementById(id);

const today = () => {
    const date = new Date();
    return date.toISOString().slice(0, 10);
};

function formatDate(value) {
    if (!value) return "Not recorded";

    return new Date(value + "T00:00:00").toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
    );
}

function dateDifference(first, second) {
    const a = new Date(first + "T00:00:00");
    const b = new Date(second + "T00:00:00");

    return Math.round((b - a) / 86400000);
}

function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);
}

function openModal(id) {
    $(id).classList.remove("hidden");
}

function closeModal(id) {
    $(id).classList.add("hidden");
}

function getSortedPeriods() {
    return [...periods].sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
    );
}

function getLatestPeriod() {
    const sorted = getSortedPeriods();
    return sorted[sorted.length - 1] || null;
}

function getAverageCycle() {
    const sorted = getSortedPeriods();

    if (sorted.length < 2) return 28;

    const differences = [];

    for (let i = 1; i < sorted.length; i++) {
        const difference = dateDifference(
            sorted[i - 1].startDate,
            sorted[i].startDate
        );

        if (difference > 0 && difference < 100) {
            differences.push(difference);
        }
    }

    if (!differences.length) return 28;

    return Math.round(
        differences.reduce((sum, value) => sum + value, 0) /
        differences.length
    );
}

function getAveragePeriod() {
    if (!periods.length) return 5;

    const lengths = periods.map(period => {
        if (!period.endDate) return 5;

        return dateDifference(period.startDate, period.endDate) + 1;
    });

    return Math.round(
        lengths.reduce((sum, value) => sum + value, 0) /
        lengths.length
    );
}

function renderDashboard() {
    const latest = getLatestPeriod();
    const cycleLength = getAverageCycle();
    const periodLength = getAveragePeriod();

    $("greeting").textContent = "Welcome to TaskNest!";
    $("averageCycleLength").textContent = cycleLength + " days";
    $("averagePeriodLength").textContent = periodLength + " days";
    $("totalPeriods").textContent = periods.length;

    if (!latest) {
        $("cycleGreeting").textContent = "Start tracking your cycle";
        $("cycleMessage").textContent = "Add your first period record to see your cycle information.";
        $("currentCycleDay").textContent = "--";
        $("daysUntilPeriod").textContent = "--";
        $("lastPeriodDate").textContent = "Not recorded";
        $("nextPeriodDate").textContent = "Not available";
        $("currentPhase").textContent = "Not available";
        $("cycleStatus").textContent = "No period data available.";
        $("cycleProgressFill").style.width = "0%";
        $("cycleProgressText").textContent = "Log your first period to start.";
        return;
    }

    const nextDate = new Date(latest.startDate + "T00:00:00");
    nextDate.setDate(nextDate.getDate() + cycleLength);

    const nextString = nextDate.toISOString().slice(0, 10);
    const cycleDay = dateDifference(latest.startDate, today()) + 1;
    const daysLeft = dateDifference(today(), nextString);

    $("cycleGreeting").textContent = "Your cycle overview";
    $("cycleMessage").textContent = "Here is your estimated cycle information.";
    $("currentCycleDay").textContent = Math.max(1, cycleDay);
    $("daysUntilPeriod").textContent = daysLeft >= 0 ? daysLeft : 0;
    $("lastPeriodDate").textContent = formatDate(latest.startDate);
    $("nextPeriodDate").textContent = formatDate(nextString);

    const progress = Math.min(100, Math.max(0, cycleDay / cycleLength * 100));

    $("cycleProgressFill").style.width = progress + "%";
    $("cycleProgressText").textContent =
        `Day ${Math.max(1, cycleDay)} of approximately ${cycleLength}`;

    if (cycleDay <= periodLength) {
        $("currentPhase").textContent = "Menstrual Phase";
    } else if (cycleDay <= Math.floor(cycleLength / 2)) {
        $("currentPhase").textContent = "Follicular Phase";
    } else if (cycleDay <= Math.floor(cycleLength * 0.65)) {
        $("currentPhase").textContent = "Ovulation Window";
    } else {
        $("currentPhase").textContent = "Luteal Phase";
    }

    $("cycleStatus").textContent =
        "Cycle dates and phases are estimates based on your recorded data.";
}

function renderHistory() {
    const container = $("cycleHistoryList");
    const sorted = getSortedPeriods().reverse();

    $("historyCount").textContent = periods.length;
    $("totalPeriods").textContent = periods.length;

    if (!sorted.length) {
        container.innerHTML = "<p>No period records yet.</p>";
        $("shortestCycle").textContent = "--";
        $("longestCycle").textContent = "--";
        return;
    }

    container.innerHTML = "";

    sorted.forEach(period => {
        const card = document.createElement("div");
        card.className = "record-card";

        const details = document.createElement("div");
        const title = document.createElement("strong");
        const description = document.createElement("p");

        title.textContent = formatDate(period.startDate);
        description.textContent =
            `End: ${formatDate(period.endDate)} | Flow: ${period.flow || "Not specified"}`;

        details.append(title, description);

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Delete";

        remove.addEventListener("click", async () => {
            if (!confirm("Delete this period record?")) return;

            await deletePeriod(period.id);
            periods = periods.filter(p => String(p.id) !== String(period.id));

            renderAll();
            showToast("Period record deleted.");
        });

        card.append(details, remove);
        container.appendChild(card);
    });

    const sortedDates = getSortedPeriods();
    const cycleLengths = [];

    for (let i = 1; i < sortedDates.length; i++) {
        const diff = dateDifference(
            sortedDates[i - 1].startDate,
            sortedDates[i].startDate
        );

        if (diff > 0) cycleLengths.push(diff);
    }

    $("shortestCycle").textContent =
        cycleLengths.length ? Math.min(...cycleLengths) + " days" : "--";

    $("longestCycle").textContent =
        cycleLengths.length ? Math.max(...cycleLengths) + " days" : "--";
}

function renderSymptoms() {
    const container = $("symptomHistoryList");
    const search = $("symptomSearch").value.toLowerCase();
    const filter = $("symptomFilter").value;

    const filtered = symptoms.filter(item => {
        const matchesSearch =
            item.type.toLowerCase().includes(search) ||
            (item.notes || "").toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" || item.intensity === filter;

        return matchesSearch && matchesFilter;
    });

    $("symptomCount").textContent = filtered.length;

    if (!filtered.length) {
        container.innerHTML = "<p>No matching symptom records found.</p>";
    } else {
        container.innerHTML = "";

        [...filtered].reverse().forEach(item => {
            const card = document.createElement("div");
            card.className = "record-card";

            const details = document.createElement("div");
            const title = document.createElement("strong");
            const description = document.createElement("p");

            title.textContent = item.type;
            description.textContent =
                `${formatDate(item.date)} | ${item.intensity} | ${item.notes || "No notes"}`;

            details.append(title, description);

            const remove = document.createElement("button");
            remove.className = "delete-btn";
            remove.textContent = "Delete";

            remove.addEventListener("click", async () => {
                if (!confirm("Delete this symptom?")) return;

                await deleteSymptom(item.id);
                symptoms = symptoms.filter(s => String(s.id) !== String(item.id));

                renderAll();
                showToast("Symptom deleted.");
            });

            card.append(details, remove);
            container.appendChild(card);
        });
    }

    const recent = $("recentSymptoms");
    recent.innerHTML = "";

    if (!symptoms.length) {
        recent.textContent = "No symptoms recorded yet.";
    } else {
        symptoms.slice(-3).reverse().forEach(item => {
            const p = document.createElement("p");
            p.textContent = `${item.type} - ${item.intensity}`;
            recent.appendChild(p);
        });
    }
}

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    $("calendarMonth").textContent =
        calendarDate.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });

    const container = $("calendarDays");
    container.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        blank.style.visibility = "hidden";
        container.appendChild(blank);
    }

    const latest = getLatestPeriod();
    const cycleLength = getAverageCycle();
    const periodLength = getAveragePeriod();

    let predictedDate = null;

    if (latest) {
        predictedDate = new Date(latest.startDate + "T00:00:00");
        predictedDate.setDate(predictedDate.getDate() + cycleLength);
    }

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const cell = document.createElement("div");
        cell.textContent = day;

        if (dateString === today()) cell.classList.add("today");

        const isPeriod = periods.some(period => {
            const start = new Date(period.startDate + "T00:00:00");
            const end = new Date((period.endDate || period.startDate) + "T00:00:00");

            return date >= start && date <= end;
        });

        if (isPeriod) {
            cell.classList.add("period-day");
        } else if (predictedDate) {
            const predictionEnd = new Date(predictedDate);
            predictionEnd.setDate(predictionEnd.getDate() + periodLength - 1);

            if (date >= predictedDate && date <= predictionEnd) {
                cell.classList.add("predicted-day");
            }
        }

        container.appendChild(cell);
    }
}

function renderAll() {
    renderDashboard();
    renderHistory();
    renderSymptoms();
    renderCalendar();
}

function setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            document.querySelectorAll(".page-section").forEach(section =>
                section.classList.add("hidden")
            );

            const target = $(button.dataset.section);

            if (target) target.classList.remove("hidden");
        });
    });
}

function setupPeriodModal() {
    ["overviewLogBtn", "calendarLogBtn", "historyLogBtn"].forEach(id => {
        $(id).addEventListener("click", () => {
            $("periodForm").reset();
            $("periodStartDate").value = today();
            $("periodEndDate").value = "";
            openModal("periodModal");
        });
    });

    $("cancelBtn").addEventListener("click", () =>
        closeModal("periodModal")
    );

    $("periodForm").addEventListener("submit", async event => {
        event.preventDefault();

        const startDate = $("periodStartDate").value;
        const endDate = $("periodEndDate").value;

        if (endDate && endDate < startDate) {
            showToast("End date cannot be before start date.");
            return;
        }

        const item = {
            startDate,
            endDate,
            flow: $("periodFlow").value,
            notes: $("periodNotes").value
        };

        const saved = await addPeriod(item);
        periods.push(saved);

        closeModal("periodModal");
        renderAll();
        showToast("Period saved successfully!");
    });
}

function setupSymptomModal() {
    $("addSymptomBtn").addEventListener("click", () => {
        $("symptomForm").reset();
        $("symptomDate").value = today();
        openModal("symptomModal");
    });

    $("closeSymptomBtn").addEventListener("click", () =>
        closeModal("symptomModal")
    );

    $("symptomForm").addEventListener("submit", async event => {
        event.preventDefault();

        const item = {
            date: $("symptomDate").value,
            type: $("symptomType").value,
            intensity: $("symptomIntensity").value,
            notes: $("symptomNotes").value
        };

        const saved = await addSymptom(item);
        symptoms.push(saved);

        closeModal("symptomModal");
        renderAll();
        showToast("Symptom saved successfully!");
    });
}

function setupCalendar() {
    $("prevMonthBtn").addEventListener("click", () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });

    $("nextMonthBtn").addEventListener("click", () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });
}

function setupTheme() {
    if (localStorage.getItem("tasknest_theme") === "dark") {
        document.body.classList.add("dark");
    }

    $("themeBtn").addEventListener("click", () => {
        document.body.classList.toggle("dark");

        const theme = document.body.classList.contains("dark")
            ? "dark"
            : "light";

        localStorage.setItem("tasknest_theme", theme);
    });
}

function setupFilters() {
    $("symptomSearch").addEventListener("input", renderSymptoms);
    $("symptomFilter").addEventListener("change", renderSymptoms);
}

async function initializeApp() {
    setupNavigation();
    setupPeriodModal();
    setupSymptomModal();
    setupCalendar();
    setupTheme();
    setupFilters();

    try {
        [periods, symptoms] = await Promise.all([
            getPeriods(),
            getSymptoms()
        ]);
    } catch (error) {
        console.error(error);
        showToast("Could not load records.");
    }

    renderAll();
}

initializeApp();
