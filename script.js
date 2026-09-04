const issueForm = document.getElementById("issueForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");

const filterStatus = document.getElementById("filterStatus");
const searchInput = document.getElementById("searchInput");

const issueList = document.getElementById("issueList");
const emptyMessage = document.getElementById("emptyMessage");
const issueCount = document.getElementById("issueCount");

const openCount = document.getElementById("openCount");
const progressCount = document.getElementById("progressCount");
const closedCount = document.getElementById("closedCount");

let issues = JSON.parse(localStorage.getItem("bugIssues")) || [];


/* =========================
   SAVE ISSUES
========================= */

function saveIssues() {
    localStorage.setItem("bugIssues", JSON.stringify(issues));
}


/* =========================
   ADD ISSUE
========================= */

issueForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newIssue = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value,
        date: new Date().toLocaleDateString()
    };

    if (!newIssue.title || !newIssue.description) {
        return;
    }

    issues.unshift(newIssue);

    saveIssues();
    displayIssues();

    issueForm.reset();

    priorityInput.value = "Medium";
    statusInput.value = "Open";
});


/* =========================
   DISPLAY ISSUES
========================= */

function displayIssues() {

    const selectedStatus = filterStatus.value;
    const searchText = searchInput.value.toLowerCase().trim();

    let filteredIssues = issues.filter(function (issue) {

        const matchesStatus =
            selectedStatus === "All" ||
            issue.status === selectedStatus;

        const matchesSearch =
            issue.title.toLowerCase().includes(searchText) ||
            issue.description.toLowerCase().includes(searchText);

        return matchesStatus && matchesSearch;
    });


    issueList.innerHTML = "";

    if (filteredIssues.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    filteredIssues.forEach(function (issue) {

        const issueCard = document.createElement("div");

        issueCard.className = "issue-card";

        issueCard.innerHTML = `
            <div class="issue-header">

                <div>
                    <div class="issue-title">
                        ${escapeHTML(issue.title)}
                    </div>

                    <div class="issue-description">
                        ${escapeHTML(issue.description)}
                    </div>
                </div>

            </div>

            <div class="issue-meta">

                <span class="priority-badge ${getPriorityClass(issue.priority)}">
                    Priority: ${issue.priority}
                </span>

                <span class="status-badge ${getStatusClass(issue.status)}">
                    Status: ${issue.status}
                </span>

                <span class="issue-date">
                    <i class="fa-regular fa-calendar"></i>
                    ${issue.date}
                </span>

            </div>

            <div class="issue-actions">

                <select
                    class="form-select form-select-sm status-select"
                    data-id="${issue.id}"
                >
                    <option value="Open" ${issue.status === "Open" ? "selected" : ""}>
                        Open
                    </option>

                    <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Closed" ${issue.status === "Closed" ? "selected" : ""}>
                        Closed
                    </option>
                </select>

                <button
                    class="btn btn-danger btn-sm delete-btn"
                    data-id="${issue.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>

            </div>
        `;

        issueList.appendChild(issueCard);
    });


    updateDashboard();
    updateIssueCount(filteredIssues.length);
}


/* =========================
   PRIORITY CLASS
========================= */

function getPriorityClass(priority) {

    if (priority === "Low") {
        return "priority-low";
    }

    if (priority === "Medium") {
        return "priority-medium";
    }

    return "priority-high";
}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (status === "Open") {
        return "status-open";
    }

    if (status === "In Progress") {
        return "status-progress";
    }

    return "status-closed";
}


/* =========================
   CHANGE STATUS
========================= */

issueList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("status-select")) {
        return;
    }

    const issueId = Number(event.target.dataset.id);

    const issue = issues.find(function (item) {
        return item.id === issueId;
    });

    if (issue) {
        issue.status = event.target.value;

        saveIssues();
        displayIssues();
    }
});


/* =========================
   DELETE ISSUE
========================= */

issueList.addEventListener("click", function (event) {

    const deleteButton = event.target.closest(".delete-btn");

    if (!deleteButton) {
        return;
    }

    const issueId = Number(deleteButton.dataset.id);

    issues = issues.filter(function (issue) {
        return issue.id !== issueId;
    });

    saveIssues();
    displayIssues();
});


/* =========================
   FILTER
========================= */

filterStatus.addEventListener("change", function () {
    displayIssues();
});


/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", function () {
    displayIssues();
});


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const openIssues = issues.filter(function (issue) {
        return issue.status === "Open";
    });

    const progressIssues = issues.filter(function (issue) {
        return issue.status === "In Progress";
    });

    const closedIssues = issues.filter(function (issue) {
        return issue.status === "Closed";
    });

    openCount.textContent = openIssues.length;
    progressCount.textContent = progressIssues.length;
    closedCount.textContent = closedIssues.length;
}


/* =========================
   ISSUE COUNT
========================= */

function updateIssueCount(count) {

    issueCount.textContent =
        count + (count === 1 ? " Issue" : " Issues");
}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   INITIAL DISPLAY
========================= */

displayIssues();