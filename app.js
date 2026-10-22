/* =========================================================
   ANKMARK STUDIO ERP
   FRONTEND VERSION
   Data is temporarily stored in localStorage.
   Backend/SQLite will be connected later.
========================================================= */


/* =========================================================
   MODULE CONFIGURATION
========================================================= */

const modules = {

    clients: {
        title: "Clients",
        subtitle: "Manage your studio clients",

        fields: [
            ["name", "Client Name", "text", true],
            ["company", "Company", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["address", "Address", "text"],
            ["status", "Status", "select", ["Active", "Inactive"]],
            ["notes", "Notes", "textarea"]
        ]
    },


    projects: {
        title: "Projects",
        subtitle: "Manage client projects and production",

        fields: [
            ["name", "Project Name", "text", true],
            ["client", "Client", "text"],
            ["status", "Status", "select", [
                "Open",
                "Working",
                "Review",
                "Completed",
                "Cancelled"
            ]],
            ["priority", "Priority", "select", [
                "Low",
                "Medium",
                "High",
                "Urgent"
            ]],
            ["startDate", "Start Date", "date"],
            ["endDate", "End Date", "date"],
            ["budget", "Budget", "number"],
            ["description", "Description", "textarea"]
        ]
    },


    tasks: {
        title: "Tasks",
        subtitle: "Production tasks and assignments",

        fields: [
            ["title", "Task Name", "text", true],
            ["project", "Project", "text"],
            ["status", "Status", "select", [
                "Open",
                "Working",
                "Review",
                "Completed",
                "Cancelled"
            ]],
            ["priority", "Priority", "select", [
                "Low",
                "Medium",
                "High",
                "Urgent"
            ]],
            ["assignedTo", "Assigned To", "text"],
            ["dueDate", "Due Date", "date"],
            ["description", "Description", "textarea"]
        ]
    },


    leads: {
        title: "Leads",
        subtitle: "Manage enquiries and potential clients",

        fields: [
            ["name", "Lead Name", "text", true],
            ["company", "Company", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["source", "Source", "text"],
            ["status", "Status", "select", [
                "New",
                "Contacted",
                "Qualified",
                "Won",
                "Lost"
            ]],
            ["notes", "Notes", "textarea"]
        ]
    },


    quotations: {
        title: "Quotations",
        subtitle: "Create and manage client quotations",

        fields: [
            ["title", "Quotation Title", "text", true],
            ["client", "Client", "text"],
            ["status", "Status", "select", [
                "Draft",
                "Sent",
                "Accepted",
                "Rejected"
            ]],
            ["amount", "Amount", "number"],
            ["validUntil", "Valid Until", "date"],
            ["notes", "Notes", "textarea"]
        ]
    },


    invoices: {
        title: "Invoices",
        subtitle: "Manage studio billing",

        fields: [
            ["invoiceNo", "Invoice Number", "text", true],
            ["client", "Client", "text"],
            ["project", "Project", "text"],
            ["invoiceDate", "Invoice Date", "date", true],
            ["status", "Status", "select", [
                "Unpaid",
                "Part Paid",
                "Paid",
                "Overdue",
                "Cancelled"
            ]],
            ["amount", "Amount", "number"],
            ["dueDate", "Due Date", "date"],
            ["notes", "Notes", "textarea"]
        ]
    },


    expenses: {
        title: "Expenses",
        subtitle: "Track studio and project expenses",

        fields: [
            ["title", "Expense", "text", true],
            ["category", "Category", "text"],
            ["amount", "Amount", "number"],
            ["date", "Expense Date", "date"],
            ["project", "Project", "text"],
            ["notes", "Notes", "textarea"]
        ]
    },


    assets: {
        title: "Assets",
        subtitle: "Manage studio equipment and assets",

        fields: [
            ["name", "Asset Name", "text", true],
            ["category", "Category", "text"],
            ["serial", "Serial Number", "text"],
            ["status", "Status", "select", [
                "Available",
                "In Use",
                "Maintenance",
                "Retired"
            ]],
            ["value", "Asset Value", "number"],
            ["purchaseDate", "Purchase Date", "date"],
            ["notes", "Notes", "textarea"]
        ]
    },


    team: {
        title: "Team",
        subtitle: "Manage studio team members",

        fields: [
            ["name", "Name", "text", true],
            ["role", "Role", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "text"],
            ["status", "Status", "select", [
                "Active",
                "Inactive"
            ]],
            ["notes", "Notes", "textarea"]
        ]
    }

};


/* =========================================================
   APP STATE
========================================================= */

let currentPage = "dashboard";

let editingId = null;


/* =========================================================
   STORAGE
========================================================= */

function storageKey(module) {

    return "ankmark_" + module;

}


function getRecords(module) {

    const data =
        localStorage.getItem(
            storageKey(module)
        );

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    } catch {

        return [];

    }

}


function saveRecords(module, records) {

    localStorage.setItem(
        storageKey(module),
        JSON.stringify(records)
    );

}


/* =========================================================
   ID
========================================================= */

function generateId() {

    return Date.now() +
        Math.floor(
            Math.random() * 1000
        );

}


/* =========================================================
   DOM
========================================================= */

const pageContainer =
    document.getElementById(
        "pageContainer"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const pageSubtitle =
    document.getElementById(
        "pageSubtitle"
    );

const modal =
    document.getElementById(
        "modalOverlay"
    );

const form =
    document.getElementById(
        "recordForm"
    );

const formFields =
    document.getElementById(
        "formFields"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalSubtitle =
    document.getElementById(
        "modalSubtitle"
    );

const toast =
    document.getElementById(
        "toast"
    );

const toastMessage =
    document.getElementById(
        "toastMessage"
    );


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                openPage(page);

                document
                    .querySelector(
                        ".sidebar"
                    )
                    .classList
                    .remove("open");

            }
        );

    });


function openPage(page) {

    currentPage = page;

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page === page
            );

        });

        if (page === "backup") {

    pageTitle.textContent = "Backup & Restore";
    pageSubtitle.textContent =
        "Protect and restore your Ankmark Studio ERP data";

    renderBackupPage();

    return;
}

        if (page === "dashboard") {

        pageTitle.textContent =
            "Dashboard";

        pageSubtitle.textContent =
            "Studio overview";

        renderDashboard();

        return;
    }

    if (page === "reports") {

    pageTitle.textContent =
        "Reports";

    pageSubtitle.textContent =
        "Studio performance and financial reports";

    renderReports();

    return;
}

if (page === "calendar") {

    pageTitle.textContent = "Calendar";
    pageSubtitle.textContent =
        "Manage meetings, shoots, deadlines and studio events";

    renderCalendar();

    return;
}

    const module =
        modules[page];

    pageTitle.textContent =
        module.title;

    pageSubtitle.textContent =
        module.subtitle;

    renderModule(page);

}


/* =========================================================
   DASHBOARD
========================================================= */


function renderDashboard() {

    const clients = getRecords("clients");
    const projects = getRecords("projects");
    const tasks = getRecords("tasks");
    const invoices = getRecords("invoices");
    const expenses = getRecords("expenses");

    const openTasks = tasks.filter(
        task =>
            task.status !== "Completed" &&
            task.status !== "Cancelled"
    );

    const outstanding = invoices
        .filter(
            invoice =>
                invoice.status !== "Paid" &&
                invoice.status !== "Cancelled"
        )
        .reduce(
            (total, invoice) =>
                total + Number(invoice.amount || 0),
            0
        );

    const paidInvoices = invoices
        .filter(invoice => invoice.status === "Paid")
        .reduce(
            (total, invoice) =>
                total + Number(invoice.amount || 0),
            0
        );

    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );

    const openingBalance = Number(
        localStorage.getItem("ankmark_opening_balance") || 0
    );

    const availableFunds =
        openingBalance + paidInvoices - totalExpenses;

    pageContainer.innerHTML = `

        <div class="stats-grid">

            ${statCard(
                "Clients",
                clients.length,
                "Total client records"
            )}

            ${statCard(
                "Projects",
                projects.length,
                "Studio projects"
            )}

            ${statCard(
                "Open Tasks",
                openTasks.length,
                "Pending production work"
            )}

            ${statCard(
                "Outstanding",
                "₹" + formatMoney(outstanding),
                "Unpaid invoices"
            )}

            ${statCard(
                "Available Funds",
                "₹" + formatMoney(availableFunds),
                "Current studio funds"
            )}

        </div>

        <div class="dashboard-grid">

            <div class="panel">

                <div class="panel-header">

                    <div class="panel-title">
                        Recent Projects
                    </div>

                    <button
                        class="panel-link"
                        onclick="openPage('projects')">
                        View all
                    </button>

                </div>

                ${renderRecentProjects(projects)}

            </div>

        </div>

        <div id="cashflowSection">
            ${buildCashflowSection(new Date().getFullYear())}
        </div>

    `;
}

function statCard(
    label,
    number,
    description
) {

    return `

        <div class="stat-card">

            <div class="stat-label">
                ${label}
            </div>

            <div class="stat-number">
                ${number}
            </div>

            <div class="stat-description">
                ${description}
            </div>

        </div>

    `;

}


function quickAction(
    title,
    description,
    page
) {

    return `

        <button
            class="quick-action"
            onclick="newRecord('${page}')">

            <strong>
                ${title}
            </strong>

            <span>
                ${description}
            </span>

        </button>

    `;

}


/* =========================================================
   MONTHLY MONEY FLOW + NET CASH FLOW
   Uses existing ERP invoice and expense records.
========================================================= */

function buildCashflowSection(selectedYear) {

    const invoices = getRecords("invoices");
    const expenses = getRecords("expenses");

    const currentYear = new Date().getFullYear();

    const years = new Set([currentYear, selectedYear]);

    invoices.forEach(invoice => {
        const date = getReportInvoiceDate(invoice);

        if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            years.add(Number(date.slice(0, 4)));
        }
    });

    expenses.forEach(expense => {
        const date = String(expense.date || "").slice(0, 10);

        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            years.add(Number(date.slice(0, 4)));
        }
    });

    const yearOptions = [...years]
        .filter(Number.isFinite)
        .sort((a, b) => b - a)
        .map(year => `
            <option
                value="${year}"
                ${year === selectedYear ? "selected" : ""}
            >${year}</option>
        `)
        .join("");

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const monthlyData = months.map((month, index) => ({
        month,
        received: 0,
        spent: 0,
        net: 0
    }));

    /* MONEY RECEIVED
       Paid invoices grouped by invoice date.
    */

    invoices.forEach(invoice => {

        if (invoice.status !== "Paid") return;

        const date = getReportInvoiceDate(invoice);

        if (!date || date.length < 10) return;

        const year = Number(date.slice(0, 4));
        const monthIndex = Number(date.slice(5, 7)) - 1;

        if (
            year === selectedYear &&
            monthIndex >= 0 &&
            monthIndex < 12
        ) {
            monthlyData[monthIndex].received +=
                Number(invoice.amount || 0);
        }
    });

    /* MONEY SPENT
       Expenses grouped by expense date.
    */

    expenses.forEach(expense => {

        const date = String(expense.date || "").slice(0, 10);

        if (!date || date.length < 10) return;

        const year = Number(date.slice(0, 4));
        const monthIndex = Number(date.slice(5, 7)) - 1;

        if (
            year === selectedYear &&
            monthIndex >= 0 &&
            monthIndex < 12
        ) {
            monthlyData[monthIndex].spent +=
                Number(expense.amount || 0);
        }
    });

    monthlyData.forEach(item => {
        item.net = item.received - item.spent;
    });

    const totalReceived = monthlyData.reduce(
        (sum, item) => sum + item.received, 0
    );

    const totalSpent = monthlyData.reduce(
        (sum, item) => sum + item.spent, 0
    );

    const totalNet = totalReceived - totalSpent;

    return `

        <div class="cashflow-layout">

            <!-- MONTHLY GRAPH -->

            <section class="cashflow-chart-panel">

                <div class="cashflow-panel-header">

                    <div>
                        <div class="cashflow-panel-title">
                            Monthly Money Flow
                        </div>

                        <div class="cashflow-panel-subtitle">
                            Money received compared with money spent
                        </div>
                    </div>

                    <select
                        class="cashflow-year-select"
                        aria-label="Select financial year"
                        onchange="renderCashflowYear(this.value)"
                    >
                        ${yearOptions}
                    </select>

                </div>

                <div class="cashflow-legend">

                    <div class="cashflow-legend-item">
                        <span class="cashflow-legend-line received"></span>
                        Money Received
                    </div>

                    <div class="cashflow-legend-item">
                        <span class="cashflow-legend-line spent"></span>
                        Money Spent
                    </div>

                </div>

                <div class="cashflow-chart">
                    ${buildCashflowSVG(monthlyData)}
                </div>

                <div class="cashflow-month-details"
                     style="margin-top:16px;">

                    <div class="cashflow-detail-item">
                        <span class="cashflow-detail-label">
                            Total Received
                        </span>

                        <span class="cashflow-detail-value received">
                            ₹${formatMoney(totalReceived)}
                        </span>
                    </div>

                    <div class="cashflow-detail-item">
                        <span class="cashflow-detail-label">
                            Total Spent
                        </span>

                        <span class="cashflow-detail-value spent">
                            ₹${formatMoney(totalSpent)}
                        </span>
                    </div>

                </div>

            </section>


            <!-- MONTHLY NET CASH FLOW -->

            <section class="cashflow-net-panel">

                <div class="cashflow-panel-header">

                    <div>
                        <div class="cashflow-panel-title">
                            Net Cash Flow
                        </div>

                        <div class="cashflow-panel-subtitle">
                            Received minus spent · ${selectedYear}
                        </div>
                    </div>

                </div>

                <div class="cashflow-net-list">

                    ${monthlyData.map(item => {

                        const netClass =
                            item.net > 0
                                ? "positive"
                                : item.net < 0
                                    ? "negative"
                                    : "neutral";

                        return `

                            <div class="cashflow-month-row">

                                <div class="cashflow-month-header">

                                    <span class="cashflow-month-name">
                                        ${item.month}
                                    </span>

                                    <span class="cashflow-net-amount ${netClass}">
                                        ${item.net < 0 ? "−" : ""}
                                        ₹${formatMoney(Math.abs(item.net))}
                                    </span>

                                </div>

                                <div class="cashflow-month-details">

                                    <div class="cashflow-detail-item">

                                        <span class="cashflow-detail-label">
                                            Received
                                        </span>

                                        <span class="cashflow-detail-value received">
                                            ₹${formatMoney(item.received)}
                                        </span>

                                    </div>

                                    <div class="cashflow-detail-item">

                                        <span class="cashflow-detail-label">
                                            Spent
                                        </span>

                                        <span class="cashflow-detail-value spent">
                                            ₹${formatMoney(item.spent)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        `;

                    }).join("")}

                </div>

                <div class="cashflow-net-summary">

                    <div class="cashflow-net-summary-label">
                        Net Cash Flow · ${selectedYear}
                    </div>

                    <div class="cashflow-net-summary-value ${
                        totalNet > 0
                            ? "positive"
                            : totalNet < 0
                                ? "negative"
                                : "neutral"
                    }">

                        ${totalNet < 0 ? "−" : ""}
                        ₹${formatMoney(Math.abs(totalNet))}

                    </div>

                </div>

            </section>

        </div>

    `;
}


/* =========================================================
   DRAW THE TWO-LINE MONTHLY GRAPH
========================================================= */

function buildCashflowSVG(monthlyData) {

    const width = 720;
    const height = 280;

    const left = 58;
    const right = 14;
    const top = 18;
    const bottom = 38;

    const graphWidth = width - left - right;
    const graphHeight = height - top - bottom;

    const values = monthlyData.flatMap(item => [
        item.received,
        item.spent
    ]);

    const maxValue = Math.max(0, ...values);

    const scaleMax = maxValue > 0
        ? maxValue * 1.15
        : 100;

    const x = index =>
        left + (index * graphWidth / 11);

    const y = value =>
        top + graphHeight -
        (value / scaleMax) * graphHeight;

    const shortMonths = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const receivedPoints = monthlyData.map(
        (item, index) => `${x(index)},${y(item.received)}`
    ).join(" ");

    const spentPoints = monthlyData.map(
        (item, index) => `${x(index)},${y(item.spent)}`
    ).join(" ");

    let grid = "";

    for (let i = 0; i <= 4; i++) {

        const value = scaleMax * i / 4;
        const positionY = y(value);

        grid += `
            <line
                x1="${left}"
                y1="${positionY}"
                x2="${width - right}"
                y2="${positionY}"
                class="cashflow-grid-line"
            />

            <text
                x="${left - 9}"
                y="${positionY + 4}"
                text-anchor="end"
            >${escapeHTML(compactCashflowNumber(value))}</text>
        `;
    }

    const monthLabels = shortMonths.map(
        (month, index) => `
            <text
                x="${x(index)}"
                y="${height - 12}"
                text-anchor="middle"
            >${month}</text>
        `
    ).join("");

    const receivedDots = monthlyData.map(
        (item, index) => `
            <circle
                cx="${x(index)}"
                cy="${y(item.received)}"
                r="3.5"
                class="cashflow-point-received"
            >
                <title>
                    ${item.month}: Received ₹${formatMoney(item.received)}
                </title>
            </circle>
        `
    ).join("");

    const spentDots = monthlyData.map(
        (item, index) => `
            <circle
                cx="${x(index)}"
                cy="${y(item.spent)}"
                r="3.5"
                class="cashflow-point-spent"
            >
                <title>
                    ${item.month}: Spent ₹${formatMoney(item.spent)}
                </title>
            </circle>
        `
    ).join("");

    return `

        <svg
            class="cashflow-svg"
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label="Monthly money received and money spent line graph"
        >

            ${grid}

            <polyline
                class="cashflow-line-received"
                points="${receivedPoints}"
            />

            <polyline
                class="cashflow-line-spent"
                points="${spentPoints}"
            />

            ${receivedDots}
            ${spentDots}
            ${monthLabels}

        </svg>

    `;
}


/* =========================================================
   COMPACT GRAPH AXIS VALUES
========================================================= */

function compactCashflowNumber(value) {

    const number = Number(value) || 0;

    if (number >= 10000000) {
        return (number / 10000000).toFixed(1) + "Cr";
    }

    if (number >= 100000) {
        return (number / 100000).toFixed(1) + "L";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "k";
    }

    return Math.round(number).toString();
}


/* =========================================================
   CHANGE THE DISPLAYED YEAR
========================================================= */

function renderCashflowYear(year) {

    const section = document.getElementById("cashflowSection");

    if (!section) return;

    const selectedYear = Number(year);

    if (!Number.isFinite(selectedYear)) return;

    section.innerHTML = buildCashflowSection(selectedYear);
}


function renderRecentProjects(
    projects
) {

    if (!projects.length) {

        return `

            <div class="empty-state">

                <div class="empty-icon">
                    ▣
                </div>

                <div class="empty-title">
                    No projects yet
                </div>

                <div class="empty-description">
                    Create your first studio project.
                </div>

            </div>

        `;

    }


    return projects
        .slice(-6)
        .reverse()
        .map(project => {

            return `

                <div class="project-row">

                    <div>

                        <div class="project-name">
                            ${escapeHTML(
                                project.name
                            )}
                        </div>

                        <div class="project-client">
                            ${escapeHTML(
                                project.client ||
                                "No client"
                            )}
                        </div>

                    </div>

                    ${statusBadge(
                        project.status
                    )}

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   MODULE PAGE
========================================================= */

function renderModule(
    moduleName,
    search = ""
) {

    const module =
        modules[moduleName];

    let records =
        getRecords(moduleName);


    if (search) {

        const query =
            search.toLowerCase();

        records =
            records.filter(record => {

                return Object
                    .values(record)
                    .some(value =>
                        String(value)
                            .toLowerCase()
                            .includes(query)
                    );

            });

    }


    pageContainer.innerHTML = `

        <div class="page-toolbar">

            <div class="toolbar-left">

                <input
                    class="search-box"
                    id="moduleSearch"
                    placeholder="Search ${module.title.toLowerCase()}..."
                    value="${escapeHTML(search)}"
                >

            </div>

            <button
                class="button primary"
                onclick="newRecord('${moduleName}')">

                + New ${singular(module.title)}

            </button>

        </div>


        <div class="table-wrapper">

            ${renderTable(
                moduleName,
                records
            )}

        </div>

    `;


    const searchInput =
        document.getElementById(
            "moduleSearch"
        );


    searchInput.addEventListener(
        "input",
        () => {

            renderModule(
                moduleName,
                searchInput.value
            );

        }
    );

}


/* =========================================================
   TABLE
========================================================= */

function renderTable(
    moduleName,
    records
) {

    const module =
        modules[moduleName];


    if (!records.length) {

        return `

            <div class="empty-state">

                <div class="empty-icon">
                    ${moduleIcon(moduleName)}
                </div>

                <div class="empty-title">
                    No ${module.title.toLowerCase()} found
                </div>

                <div class="empty-description">
                    Click the + New button to create one.
                </div>

            </div>

        `;

    }


    const visibleFields =
        module.fields.filter(
            field =>
                field[0] !== "notes" &&
                field[0] !== "description"
        );


    return `

        <table>

            <thead>

                <tr>

                    ${visibleFields
                        .slice(0, 6)
                        .map(field =>
                            `<th>${field[1]}</th>`
                        )
                        .join("")
                    }

                    <th>
                        Actions
                    </th>

                </tr>

            </thead>


            <tbody>

                ${records
                    .slice()
                    .reverse()
                    .map(record => {

                        return `

                            <tr>

                                ${visibleFields
                                    .slice(0, 6)
                                    .map(field => {

                                        const key =
                                            field[0];

                                        const value =
                                            record[key];

                                        return `

                                            <td>

                                                ${formatCell(
                                                    key,
                                                    value
                                                )}

                                            </td>

                                        `;

                                    })
                                    .join("")
                                }


                                <td>

                                    <div class="table-actions">

                                        <button
                                            class="table-action"
                                            onclick="editRecord(
                                                '${moduleName}',
                                                ${record.id}
                                            )">
                                            Edit
                                        </button>

                                        <button
                                            class="table-action"
                                            onclick="deleteRecord(
                                                '${moduleName}',
                                                ${record.id}
                                            )">
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    })
                    .join("")
                }

            </tbody>

        </table>

    `;

}


/* =========================================================
   FORMAT TABLE CELL
========================================================= */

function formatCell(
    key,
    value
) {

    if (
        key === "amount" ||
        key === "budget" ||
        key === "value"
    ) {

        return "₹" +
            formatMoney(value);

    }


    if (
        key === "status"
    ) {

        return statusBadge(value);

    }


    return escapeHTML(
        value || "—"
    );

}


/* =========================================================
   STATUS
========================================================= */

function statusBadge(
    status
) {

    if (!status) {

        return "—";

    }


    const className =
        String(status)
            .toLowerCase()
            .replace(/\s+/g, "-");


    return `

        <span class="status ${className}">
            ${escapeHTML(status)}
        </span>

    `;

}


/* =========================================================
   NEW RECORD
========================================================= */

function newRecord(
    moduleName
) {

    currentPage =
        moduleName;

    editingId = null;

    const module =
        modules[moduleName];


    modalTitle.textContent =
        "New " +
        singular(module.title);


    modalSubtitle.textContent =
        module.subtitle;


    buildForm(
        moduleName
    );


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   EDIT RECORD
========================================================= */

function editRecord(
    moduleName,
    id
) {

    currentPage =
        moduleName;

    editingId =
        Number(id);


    const records =
        getRecords(moduleName);


    const record =
        records.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!record) {

        showToast(
            "Record not found"
        );

        return;

    }


    const module =
        modules[moduleName];


    modalTitle.textContent =
        "Edit " +
        singular(module.title);


    modalSubtitle.textContent =
        "Update this record";


    buildForm(
        moduleName,
        record
    );


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   BUILD FORM
========================================================= */

function buildForm(
    moduleName,
    record = {}
) {

    const module =
        modules[moduleName];


    formFields.innerHTML = `

        <div class="form-grid">

            ${module.fields
                .map(field =>
                    createField(
                        field,
                        record
                    )
                )
                .join("")
            }

        </div>

    `;

}


/* =========================================================
   CREATE FIELD
========================================================= */

function createField(
    field,
    record
) {

    const key =
        field[0];

    const label =
        field[1];

    const type =
        field[2];

    const required =
        field[3] === true;


    const value =
        record[key] || "";


    let input = "";


    if (type === "select") {

        input = `

            <select
                name="${key}"
                ${required ? "required" : ""}
            >

                <option value="">
                    Select ${label}
                </option>

                ${field[3]
                    .map(option => {

                        return `

                            <option
                                value="${escapeHTML(option)}"
                                ${value === option
                                    ? "selected"
                                    : ""
                                }
                            >
                                ${escapeHTML(option)}
                            </option>

                        `;

                    })
                    .join("")
                }

            </select>

        `;

    }

    else if (type === "textarea") {

        input = `

            <textarea
                name="${key}"
                ${required ? "required" : ""}
            >${escapeHTML(value)}</textarea>

        `;

    }

    else {

        input = `

            <input
                type="${type}"
                name="${key}"
                value="${escapeHTML(value)}"
                ${required ? "required" : ""}
            >

        `;

    }


    const full =
        type === "textarea"
            ? "full"
            : "";


    return `

        <div class="form-field ${full}">

            <label>
                ${label}
                ${required ? "*" : ""}
            </label>

            ${input}

        </div>

    `;

}


/* =========================================================
   SAVE FORM
========================================================= */

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const moduleName =
            currentPage;


        const module =
            modules[moduleName];


        const formData =
            new FormData(form);


        const record = {};


        module.fields.forEach(
            field => {

                const key =
                    field[0];

                record[key] =
                    formData.get(key) || "";

            }
        );


        let records =
            getRecords(moduleName);


        if (editingId) {

            records =
                records.map(item => {

                    if (
                        Number(item.id) ===
                        Number(editingId)
                    ) {

                        return {
                            ...item,
                            ...record
                        };

                    }

                    return item;

                });


            showToast(
                "Record updated successfully"
            );

        }

        else {

            record.id =
                generateId();

            record.createdAt =
                new Date()
                    .toISOString();


            records.push(
                record
            );


            showToast(
                "Record created successfully"
            );

        }


        saveRecords(
            moduleName,
            records
        );


        closeModal();


        renderModule(
            moduleName
        );


        editingId = null;

    }
);


/* =========================================================
   DELETE
========================================================= */

function deleteRecord(
    moduleName,
    id
) {

    const confirmed =
        confirm(
            "Delete this record?"
        );


    if (!confirmed) {

        return;

    }


    let records =
        getRecords(moduleName);


    records =
        records.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    saveRecords(
        moduleName,
        records
    );


    showToast(
        "Record deleted"
    );


    renderModule(
        moduleName
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    modal.classList.remove(
        "show"
    );

    form.reset();

    editingId = null;

}


document
    .getElementById(
        "modalClose"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

document
    .getElementById(
        "mobileMenu"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "sidebar"
                )
                .classList
                .toggle("open");

        }
    );


/* =========================================================
   HELPERS
========================================================= */

function singular(
    word
) {

    if (
        word.endsWith("ies")
    ) {

        return word.slice(
            0,
            -3
        ) + "y";

    }


    if (
        word.endsWith("s")
    ) {

        return word.slice(
            0,
            -1
        );

    }


    return word;

}


function formatMoney(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function moduleIcon(
    module
) {

    const icons = {

        clients: "♙",
        projects: "▣",
        tasks: "✓",
        leads: "◎",
        quotations: "▤",
        invoices: "₹",
        expenses: "−",
        assets: "▧",
        team: "♙"

    };


    return icons[module] || "▣";

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message
) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}

/* =========================================================
   REPORTS MODULE
========================================================= */

function renderReports() {

    const today = new Date();

    const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    const lastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    );

    pageContainer.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>

                    <div class="panel-title">
                        Monthly Report
                    </div>

                    <div style="
                        color:#777;
                        font-size:12px;
                        margin-top:4px;
                    ">
                        See your studio performance
                        for any date range.
                    </div>

                </div>

            </div>


            <div class="form-grid">

                <div class="form-field">

                    <label>
                        From Date
                    </label>

                    <input
                        type="date"
                        id="reportFrom"
                        value="${reportDateInput(firstDay)}"
                    >

                </div>


                <div class="form-field">

                    <label>
                        To Date
                    </label>

                    <input
                        type="date"
                        id="reportTo"
                        value="${reportDateInput(lastDay)}"
                    >

                </div>

            </div>


            <div style="
                display:flex;
                gap:8px;
                margin-top:12px;
                flex-wrap:wrap;
            ">

                <button
                    class="button secondary"
                    onclick="reportThisMonth()">
                    This Month
                </button>

                <button
                    class="button secondary"
                    onclick="reportLastMonth()">
                    Last Month
                </button>

                <button
                    class="button primary"
                    onclick="generateStudioReport()">
                    Generate Report
                </button>

            </div>

        </div>


        <div
            id="studioReportResult"
            style="margin-top:18px;">
        </div>

    `;

    generateStudioReport();

}


/* =========================================================
   GENERATE REPORT
========================================================= */

function generateStudioReport() {

    const from =
        document.getElementById(
            "reportFrom"
        ).value;

    const to =
        document.getElementById(
            "reportTo"
        ).value;


    if (!from || !to) {

        showToast(
            "Please select a date range"
        );

        return;

    }


    if (from > to) {

        showToast(
            "From date cannot be after To date"
        );

        return;

    }


    /*
       Existing ERP records
    */

    const projects =
        getRecords("projects");

    const invoices =
        getRecords("invoices");

    const expenses =
        getRecords("expenses");


    /*
       PROJECTS
    */

    const completedProjects =
        projects.filter(
            project =>
                project.status === "Completed" &&
                reportDateBetween(
                    project.endDate,
                    from,
                    to
                )
        );


    const startedProjects =
        projects.filter(
            project =>
                reportDateBetween(
                    project.startDate,
                    from,
                    to
                )
        );


    /*
       INVOICES
    */

    const periodInvoices =
        invoices.filter(
            invoice =>
                reportDateBetween(
                    getReportInvoiceDate(invoice),
                    from,
                    to
                )
        );


    const totalInvoiced =
        periodInvoices
            .filter(
                invoice =>
                    invoice.status !== "Cancelled"
            )
            .reduce(
                (total, invoice) =>
                    total +
                    Number(
                        invoice.amount || 0
                    ),
                0
            );


    /*
       PAID INVOICES
    */

    const moneyReceived =
        periodInvoices
            .filter(
                invoice =>
                    invoice.status === "Paid"
            )
            .reduce(
                (total, invoice) =>
                    total +
                    Number(
                        invoice.amount || 0
                    ),
                0
            );


    /*
       EXPENSES
    */

    const periodExpenses =
        expenses.filter(
            expense =>
                reportDateBetween(
                    expense.date,
                    from,
                    to
                )
        );


    const totalExpenses =
        periodExpenses.reduce(
            (total, expense) =>
                total +
                Number(
                    expense.amount || 0
                ),
            0
        );


    /*
       PROFIT

       Revenue/invoiced amount
       minus expenses.
    */

    const estimatedProfit =
        totalInvoiced -
        totalExpenses;


    /*
       OUTSTANDING INVOICES
    */

    const outstanding =
        invoices
            .filter(
                invoice =>
                    invoice.status !== "Paid" &&
                    invoice.status !== "Cancelled" &&
                    getReportInvoiceDate(
                        invoice
                    ) &&
                    getReportInvoiceDate(
                        invoice
                    ) <= to
            )
            .reduce(
                (total, invoice) =>
                    total +
                    Number(
                        invoice.amount || 0
                    ),
                0
            );


    const result =
        document.getElementById(
            "studioReportResult"
        );


    result.innerHTML = `

        <div class="stats-grid">

            ${reportCard(
                "Projects Completed",
                completedProjects.length,
                "Completed in this period"
            )}

            ${reportCard(
                "Projects Started",
                startedProjects.length,
                "Started in this period"
            )}

            ${reportCard(
                "Total Invoiced",
                "₹" +
                reportMoney(totalInvoiced),
                "Invoices created"
            )}

            ${reportCard(
                "Money Received",
                "₹" +
                reportMoney(moneyReceived),
                "Paid invoices"
            )}

        </div>


        <div
            class="stats-grid"
            style="margin-top:15px;"
        >

            ${reportCard(
                "Total Expenses",
                "₹" +
                reportMoney(totalExpenses),
                "Expenses recorded"
            )}

            ${reportCard(
                "Estimated Profit",
                "₹" +
                reportMoney(estimatedProfit),
                "Invoiced minus expenses"
            )}

            ${reportCard(
                "Outstanding",
                "₹" +
                reportMoney(outstanding),
                "Unpaid amount"
            )}

            ${reportCard(
                "Invoice Records",
                periodInvoices.length,
                "Invoices in period"
            )}

        </div>


        <div
            class="dashboard-grid"
            style="margin-top:18px;"
        >

            <div class="panel">

                <div class="panel-header">

                    <div class="panel-title">
                        Completed Projects
                    </div>

                </div>

                ${reportProjectTable(
                    completedProjects
                )}

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div class="panel-title">
                        Financial Activity
                    </div>

                </div>

                ${reportFinanceTable(
                    periodInvoices,
                    periodExpenses
                )}

            </div>

        </div>

    `;

}


/* =========================================================
   REPORT CARD
========================================================= */

function reportCard(
    title,
    value,
    description
) {

    return `

        <div class="stat-card">

            <div class="stat-label">
                ${title}
            </div>

            <div class="stat-value">
                ${value}
            </div>

            <div class="stat-meta">
                ${description}
            </div>

        </div>

    `;

}


/* =========================================================
   PROJECT TABLE
========================================================= */

function reportProjectTable(
    projects
) {

    if (!projects.length) {

        return `

            <div class="empty-state">

                <div class="empty-title">
                    No completed projects
                </div>

                <div class="empty-description">
                    No projects were completed
                    during this period.
                </div>

            </div>

        `;

    }


    return `

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>

                        <th>
                            Project
                        </th>

                        <th>
                            Client
                        </th>

                        <th>
                            Budget
                        </th>

                        <th>
                            Completed
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${projects.map(
                        project => `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    project.name || "—"
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    project.client || "—"
                                )}
                            </td>

                            <td>
                                ₹${reportMoney(
                                    project.budget
                                )}
                            </td>

                            <td>
                                ${formatReportDate(
                                    project.endDate
                                )}
                            </td>

                        </tr>

                    `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   FINANCE TABLE
========================================================= */

function reportFinanceTable(
    invoices,
    expenses
) {

    if (
        !invoices.length &&
        !expenses.length
    ) {

        return `

            <div class="empty-state">

                <div class="empty-title">
                    No financial activity
                </div>

                <div class="empty-description">
                    No invoices or expenses
                    in this period.
                </div>

            </div>

        `;

    }


    return `

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>

                        <th>
                            Type
                        </th>

                        <th>
                            Name
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${invoices.map(
                        invoice => `

                        <tr>

                            <td>
                                Invoice
                            </td>

                            <td>
                                ${escapeHTML(
                                    invoice.invoiceNo || "—"
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    invoice.status
                                )}
                            </td>

                            <td>
                                ₹${reportMoney(
                                    invoice.amount
                                )}
                            </td>

                        </tr>

                    `
                    ).join("")}


                    ${expenses.map(
                        expense => `

                        <tr>

                            <td>
                                Expense
                            </td>

                            <td>
                                ${escapeHTML(
                                    expense.title || "—"
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    expense.category || "—"
                                )}
                            </td>

                            <td>
                                ₹${reportMoney(
                                    expense.amount
                                )}
                            </td>

                        </tr>

                    `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   REPORT DATE HELPERS
========================================================= */

function reportDateBetween(
    date,
    from,
    to
) {

    if (!date) {
        return false;
    }

    const value =
        String(date).slice(0, 10);

    return (
        value >= from &&
        value <= to
    );

}


function getReportInvoiceDate(
    invoice
) {

    /*
       REPORT DATE PRIORITY

       1. Invoice Date
       2. Existing createdAt date
       3. Due Date

       Invoice Date is the correct date
       for monthly invoice reporting.
    */


    if (invoice.invoiceDate) {

        return String(
            invoice.invoiceDate
        ).slice(0, 10);

    }


    /*
       Backward compatibility:

       Existing invoices created before
       Invoice Date was added will still
       be included using their createdAt date.
    */

    if (invoice.createdAt) {

        return String(
            invoice.createdAt
        ).slice(0, 10);

    }


    /*
       Final fallback for old records.
    */

    if (invoice.dueDate) {

        return String(
            invoice.dueDate
        ).slice(0, 10);

    }


    return "";

}

function reportDateInput(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


function formatReportDate(
    date
) {

    if (!date) {
        return "—";
    }

    const d =
        new Date(
            String(date).slice(0, 10) +
            "T00:00:00"
        );

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function reportMoney(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   QUICK REPORT PERIODS
========================================================= */

function reportThisMonth() {

    const now = new Date();

    const from =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

    const to =
        new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        );

    document.getElementById(
        "reportFrom"
    ).value =
        reportDateInput(from);

    document.getElementById(
        "reportTo"
    ).value =
        reportDateInput(to);

    generateStudioReport();

}


function reportLastMonth() {

    const now = new Date();

    const from =
        new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

    const to =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        );

    document.getElementById(
        "reportFrom"
    ).value =
        reportDateInput(from);

    document.getElementById(
        "reportTo"
    ).value =
        reportDateInput(to);

    generateStudioReport();

}

/* =========================================================
   CALENDAR MODULE
========================================================= */

let calendarCurrentDate = new Date();


function renderCalendar() {

    const year =
        calendarCurrentDate.getFullYear();

    const month =
        calendarCurrentDate.getMonth();


    const monthName =
        calendarCurrentDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    const events =
        getRecords("calendar_events");


    let calendarHTML = "";


    /*
       Previous month's visible days
    */

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        calendarHTML += `

            <div class="calendar-day other-month">

                <div class="calendar-date">
                    ${previousDays - i}
                </div>

            </div>

        `;

    }


    /*
       Current month's days
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            calendarDateString(
                year,
                month,
                day
            );


        const dayEvents =
            events.filter(
                event =>
                    event.date === dateString
            );


        const today =
            isCalendarToday(
                year,
                month,
                day
            );


        calendarHTML += `

            <div
                class="calendar-day ${today ? "today" : ""}"
                onclick="openCalendarEventForm('${dateString}')"
            >

                <div class="calendar-date">
                    ${day}
                </div>

                <div class="calendar-events">

                    ${dayEvents.map(
                        event => `

                        <div
                            class="calendar-event"
                            onclick="event.stopPropagation(); editCalendarEvent('${event.id}')"
                        >

                            <strong>
                                ${escapeHTML(
                                    event.title || "Untitled"
                                )}
                            </strong>

                            ${
                                event.startTime
                                ? `
                                    <small>
                                        ${escapeHTML(
                                            event.startTime
                                        )}
                                    </small>
                                  `
                                : ""
                            }

                        </div>

                    `
                    ).join("")}

                </div>

            </div>

        `;

    }


    /*
       Fill remaining calendar cells
    */

    const totalCells =
        firstDay +
        daysInMonth;


    const remainingCells =
        totalCells % 7 === 0
            ? 0
            : 7 - (totalCells % 7);


    for (
        let day = 1;
        day <= remainingCells;
        day++
    ) {

        calendarHTML += `

            <div class="calendar-day other-month">

                <div class="calendar-date">
                    ${day}
                </div>

            </div>

        `;

    }


    pageContainer.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>

                    <div class="panel-title">
                        ${monthName}
                    </div>

                    <div style="
                        color:#777;
                        font-size:12px;
                        margin-top:4px;
                    ">
                        Meetings, shoots, deadlines
                        and studio events
                    </div>

                </div>


                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                ">

                    <button
                        class="button secondary"
                        onclick="calendarPreviousMonth()">
                        ←
                    </button>

                    <button
                        class="button secondary"
                        onclick="calendarToday()">
                        Today
                    </button>

                    <button
                        class="button secondary"
                        onclick="calendarNextMonth()">
                        →
                    </button>

                    <button
                        class="button primary"
                        onclick="openCalendarEventForm()">
                        + Add Event
                    </button>

                </div>

            </div>


            <div class="calendar-weekdays">

                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>

            </div>


            <div class="calendar-grid">

                ${calendarHTML}

            </div>

        </div>


        <div
            id="calendarEventModal"
            class="modal-backdrop"
            style="display:none;"
        >

            <div class="modal">

                <div class="modal-header">

                    <div>

                        <div
                            class="modal-title"
                            id="calendarModalTitle"
                        >
                            Add Event
                        </div>

                    </div>

                    <button
                        class="modal-close"
                        onclick="closeCalendarEventForm()"
                    >
                        ×
                    </button>

                </div>


                <div
                    id="calendarEventForm"
                    class="form-grid"
                ></div>


                <div
                    id="calendarEventActions"
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:8px;
                        margin-top:18px;
                    "
                >

                    <div>

                        <button
                            id="calendarDeleteButton"
                            class="button danger"
                            style="display:none;"
                            onclick="deleteCalendarEvent()"
                        >
                            Delete
                        </button>

                    </div>


                    <div style="
                        display:flex;
                        gap:8px;
                    ">

                        <button
                            class="button secondary"
                            onclick="closeCalendarEventForm()"
                        >
                            Cancel
                        </button>

                        <button
                            class="button primary"
                            onclick="saveCalendarEvent()"
                        >
                            Save Event
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   CALENDAR NAVIGATION
========================================================= */

function calendarPreviousMonth() {

    calendarCurrentDate =
        new Date(
            calendarCurrentDate.getFullYear(),
            calendarCurrentDate.getMonth() - 1,
            1
        );

    renderCalendar();

}


function calendarNextMonth() {

    calendarCurrentDate =
        new Date(
            calendarCurrentDate.getFullYear(),
            calendarCurrentDate.getMonth() + 1,
            1
        );

    renderCalendar();

}


function calendarToday() {

    calendarCurrentDate =
        new Date();

    renderCalendar();

}


/* =========================================================
   OPEN EVENT FORM
========================================================= */

let editingCalendarEventId = null;


function openCalendarEventForm(
    selectedDate = ""
) {

    editingCalendarEventId = null;


    const modal =
        document.getElementById(
            "calendarEventModal"
        );


    const form =
        document.getElementById(
            "calendarEventForm"
        );


    const title =
        document.getElementById(
            "calendarModalTitle"
        );


    const deleteButton =
        document.getElementById(
            "calendarDeleteButton"
        );


    title.textContent =
        "Add Event";


    deleteButton.style.display =
        "none";


    form.innerHTML = `

        <div class="form-field">

            <label>
                Event Title
            </label>

            <input
                id="calendarTitle"
                type="text"
                placeholder="Client meeting"
            >

        </div>


        <div class="form-field">

            <label>
                Event Type
            </label>

            <select id="calendarType">

                <option>
                    Client Meeting
                </option>

                <option>
                    Project Deadline
                </option>

                <option>
                    Shoot
                </option>

                <option>
                    Presentation
                </option>

                <option>
                    Delivery
                </option>

                <option>
                    Follow-up
                </option>

                <option>
                    Other
                </option>

            </select>

        </div>


        <div class="form-field">

            <label>
                Date
            </label>

            <input
                id="calendarDate"
                type="date"
                value="${selectedDate || calendarDateString(
                    calendarCurrentDate.getFullYear(),
                    calendarCurrentDate.getMonth(),
                    calendarCurrentDate.getDate()
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Start Time
            </label>

            <input
                id="calendarStartTime"
                type="time"
            >

        </div>


        <div class="form-field">

            <label>
                End Time
            </label>

            <input
                id="calendarEndTime"
                type="time"
            >

        </div>


        <div class="form-field">

            <label>
                Client
            </label>

            <input
                id="calendarClient"
                type="text"
                placeholder="Client name"
            >

        </div>


        <div class="form-field">

            <label>
                Project
            </label>

            <input
                id="calendarProject"
                type="text"
                placeholder="Project name"
            >

        </div>


        <div class="form-field">

            <label>
                Notes
            </label>

            <textarea
                id="calendarNotes"
                placeholder="Event notes..."
            ></textarea>

        </div>

    `;


    modal.style.display =
        "flex";

}


/* =========================================================
   EDIT EVENT
========================================================= */

function editCalendarEvent(
    id
) {

    const events =
        getRecords("calendar_events");


    const event =
        events.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!event) {

        showToast(
            "Event not found"
        );

        return;

    }


    editingCalendarEventId =
        event.id;


    const modal =
        document.getElementById(
            "calendarEventModal"
        );


    const form =
        document.getElementById(
            "calendarEventForm"
        );


    const title =
        document.getElementById(
            "calendarModalTitle"
        );


    const deleteButton =
        document.getElementById(
            "calendarDeleteButton"
        );


    title.textContent =
        "Edit Event";


    deleteButton.style.display =
        "inline-flex";


    form.innerHTML = `

        <div class="form-field">

            <label>
                Event Title
            </label>

            <input
                id="calendarTitle"
                type="text"
                value="${escapeAttribute(
                    event.title || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Event Type
            </label>

            <select id="calendarType">

                ${[
                    "Client Meeting",
                    "Project Deadline",
                    "Shoot",
                    "Presentation",
                    "Delivery",
                    "Follow-up",
                    "Other"
                ].map(
                    type => `
                        <option
                            ${
                                event.type === type
                                ? "selected"
                                : ""
                            }
                        >
                            ${type}
                        </option>
                    `
                ).join("")}

            </select>

        </div>


        <div class="form-field">

            <label>
                Date
            </label>

            <input
                id="calendarDate"
                type="date"
                value="${escapeAttribute(
                    event.date || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Start Time
            </label>

            <input
                id="calendarStartTime"
                type="time"
                value="${escapeAttribute(
                    event.startTime || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                End Time
            </label>

            <input
                id="calendarEndTime"
                type="time"
                value="${escapeAttribute(
                    event.endTime || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Client
            </label>

            <input
                id="calendarClient"
                type="text"
                value="${escapeAttribute(
                    event.client || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Project
            </label>

            <input
                id="calendarProject"
                type="text"
                value="${escapeAttribute(
                    event.project || ""
                )}"
            >

        </div>


        <div class="form-field">

            <label>
                Notes
            </label>

            <textarea
                id="calendarNotes"
            >${escapeHTML(
                event.notes || ""
            )}</textarea>

        </div>

    `;


    modal.style.display =
        "flex";

}


/* =========================================================
   SAVE EVENT
========================================================= */

function saveCalendarEvent() {

    const title =
        document.getElementById(
            "calendarTitle"
        ).value.trim();


    const type =
        document.getElementById(
            "calendarType"
        ).value;


    const date =
        document.getElementById(
            "calendarDate"
        ).value;


    const startTime =
        document.getElementById(
            "calendarStartTime"
        ).value;


    const endTime =
        document.getElementById(
            "calendarEndTime"
        ).value;


    const client =
        document.getElementById(
            "calendarClient"
        ).value.trim();


    const project =
        document.getElementById(
            "calendarProject"
        ).value.trim();


    const notes =
        document.getElementById(
            "calendarNotes"
        ).value.trim();


    if (!title) {

        showToast(
            "Event title is required"
        );

        return;

    }


    if (!date) {

        showToast(
            "Event date is required"
        );

        return;

    }


    if (
        startTime &&
        endTime &&
        startTime >= endTime
    ) {

        showToast(
            "End time must be after start time"
        );

        return;

    }


    const events =
        getRecords("calendar_events");


    if (editingCalendarEventId) {

        const index =
            events.findIndex(
                event =>
                    String(event.id) ===
                    String(
                        editingCalendarEventId
                    )
            );


        if (index !== -1) {

            events[index] = {

                ...events[index],

                title,
                type,
                date,
                startTime,
                endTime,
                client,
                project,
                notes

            };

        }

    } else {

        events.push({

            id:
                Date.now(),

            title,
            type,
            date,
            startTime,
            endTime,
            client,
            project,
            notes,

            createdAt:
                new Date().toISOString()

        });

    }


    saveRecords(
        "calendar_events",
        events
    );


    closeCalendarEventForm();

    renderCalendar();

    showToast(
        editingCalendarEventId
            ? "Event updated"
            : "Event added"
    );

}


/* =========================================================
   DELETE EVENT
========================================================= */

function deleteCalendarEvent() {

    if (!editingCalendarEventId) {
        return;
    }


    if (
        !confirm(
            "Delete this calendar event?"
        )
    ) {

        return;

    }


    const events =
        getRecords("calendar_events");


    const filtered =
        events.filter(
            event =>
                String(event.id) !==
                String(
                    editingCalendarEventId
                )
        );


    saveRecords(
        "calendar_events",
        filtered
    );


    closeCalendarEventForm();

    renderCalendar();

    showToast(
        "Event deleted"
    );

}


/* =========================================================
   CLOSE EVENT FORM
========================================================= */

function closeCalendarEventForm() {

    const modal =
        document.getElementById(
            "calendarEventModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    editingCalendarEventId =
        null;

}


/* =========================================================
   CALENDAR HELPERS
========================================================= */

function calendarDateString(
    year,
    month,
    day
) {

    return (
        year +
        "-" +
        String(
            month + 1
        ).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


function isCalendarToday(
    year,
    month,
    day
) {

    const today =
        new Date();


    return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    );

}


function escapeAttribute(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   BACKUP & RESTORE MODULE
========================================================= */

const ANKMARK_BACKUP_VERSION = "1.0";


/*
   These are the ERP storage collections.

   If your existing ERP uses these keys,
   all of them will be included in the backup.
*/

const ANKMARK_BACKUP_KEYS = [

    "projects",
    "tasks",
    "clients",
    "leads",
    "quotations",
    "invoices",
    "expenses",
    "assets",
    "team",
    "calendar_events"

];


/* =========================================================
   RENDER BACKUP PAGE
========================================================= */

function renderBackupPage() {

    const counts =
        getBackupRecordCounts();


    pageContainer.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>

                    <div class="panel-title">
                        Backup & Restore
                    </div>

                    <div style="
                        color:#777;
                        font-size:12px;
                        margin-top:4px;
                    ">
                        Protect your Ankmark Studio ERP data
                    </div>

                </div>

            </div>


            <div class="stats-grid">

                ${backupStatCard(
                    "Projects",
                    counts.projects
                )}

                ${backupStatCard(
                    "Tasks",
                    counts.tasks
                )}

                ${backupStatCard(
                    "Clients",
                    counts.clients
                )}

                ${backupStatCard(
                    "Leads",
                    counts.leads
                )}

                ${backupStatCard(
                    "Quotations",
                    counts.quotations
                )}

                ${backupStatCard(
                    "Invoices",
                    counts.invoices
                )}

                ${backupStatCard(
                    "Expenses",
                    counts.expenses
                )}

                ${backupStatCard(
                    "Calendar Events",
                    counts.calendar_events
                )}

                ${backupStatCard(
                    "Assets",
                    counts.assets
                )}

                ${backupStatCard(
                    "Team",
                    counts.team
                )}

            </div>


            <div style="
                display:grid;
                grid-template-columns:
                    repeat(
                        2,
                        minmax(0, 1fr)
                    );
                gap:16px;
                margin-top:20px;
            ">


                <!-- EXPORT -->

                <div class="panel">

                    <div style="
                        font-size:16px;
                        font-weight:700;
                        margin-bottom:8px;
                    ">
                        📦 Export Full Backup
                    </div>

                    <div style="
                        color:#777;
                        font-size:13px;
                        line-height:1.6;
                        margin-bottom:18px;
                    ">
                        Download all your current Ankmark
                        ERP records into one backup file.
                    </div>


                    <button
                        class="button primary"
                        onclick="exportAnkmarkBackup()"
                    >
                        📦 Download Backup
                    </button>

                </div>


                <!-- RESTORE -->

                <div class="panel">

                    <div style="
                        font-size:16px;
                        font-weight:700;
                        margin-bottom:8px;
                    ">
                        📥 Restore Backup
                    </div>

                    <div style="
                        color:#777;
                        font-size:13px;
                        line-height:1.6;
                        margin-bottom:18px;
                    ">
                        Restore your ERP records from a
                        previously downloaded Ankmark backup.
                    </div>


                    <input
                        type="file"
                        id="ankmarkBackupFile"
                        accept=".json,application/json"
                        style="
                            width:100%;
                            margin-bottom:12px;
                        "
                    >


                    <button
                        class="button secondary"
                        onclick="restoreAnkmarkBackup()"
                    >
                        📥 Restore Backup
                    </button>

                </div>

            </div>


            <div class="panel" style="
                margin-top:16px;
            ">

                <div style="
                    font-size:14px;
                    font-weight:700;
                    margin-bottom:8px;
                ">
                    ⚠️ Important
                </div>

                <div style="
                    color:#777;
                    font-size:12px;
                    line-height:1.7;
                ">

                    Your backup file contains your ERP records.
                    Keep it somewhere private and safe.

                    <br><br>

                    The JSON backup is for
                    <strong>restoring data</strong>.
                    PDF exports should be used for
                    reports and business documents.

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   STAT CARD
========================================================= */

function backupStatCard(
    label,
    value
) {

    return `

        <div class="stat-card">

            <div class="stat-label">
                ${escapeHTML(label)}
            </div>

            <div class="stat-value">
                ${Number(value) || 0}
            </div>

        </div>

    `;

}


/* =========================================================
   GET RECORD COUNTS
========================================================= */

function getBackupRecordCounts() {

    const counts = {};


    ANKMARK_BACKUP_KEYS.forEach(
        key => {

            const records =
                getRecords(key);


            counts[key] =
                Array.isArray(records)
                    ? records.length
                    : 0;

        }
    );


    return counts;

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

function exportAnkmarkBackup() {

    try {

        const backup = {

            backupType:
                "Ankmark Studio ERP Backup",

            backupVersion:
                ANKMARK_BACKUP_VERSION,

            exportedAt:
                new Date().toISOString(),

            data: {}

        };


        /*
           Collect every ERP data collection.
        */

        ANKMARK_BACKUP_KEYS.forEach(
            key => {

                backup.data[key] =
                    getRecords(key);

            }
        );


        /*
           Convert to JSON.
        */

        const json =
            JSON.stringify(
                backup,
                null,
                2
            );


        /*
           Create downloadable file.
        */

        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        const date =
            new Date();


        const dateString =
            date
                .toISOString()
                .slice(0, 10);


        link.href =
            url;


        link.download =
            `ankmark-backup-${dateString}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        showToast(
            "Full backup downloaded successfully"
        );


    } catch (error) {

        console.error(
            "Backup export error:",
            error
        );


        showToast(
            "Backup export failed"
        );

    }

}


/* =========================================================
   RESTORE BACKUP
========================================================= */

function restoreAnkmarkBackup() {

    const input =
        document.getElementById(
            "ankmarkBackupFile"
        );


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        showToast(
            "Please select a backup JSON file"
        );

        return;

    }


    const file =
        input.files[0];


    if (
        !file.name
            .toLowerCase()
            .endsWith(".json")
    ) {

        showToast(
            "Please select a JSON backup file"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                /*
                   Validate backup structure.
                */

                if (
                    !backup ||
                    backup.backupType !==
                        "Ankmark Studio ERP Backup"
                ) {

                    showToast(
                        "Invalid Ankmark backup file"
                    );

                    return;

                }


                if (
                    !backup.data ||
                    typeof backup.data !==
                        "object"
                ) {

                    showToast(
                        "Backup data is missing"
                    );

                    return;

                }


                /*
                   Strong warning before replacing
                   current browser data.
                */

                const confirmed =
                    confirm(
                        "Restore this backup?\n\n" +
                        "This will replace your current " +
                        "ERP records with the records from " +
                        "the backup file.\n\n" +
                        "Make sure you have a backup of " +
                        "your current data first."
                    );


                if (!confirmed) {

                    return;

                }


                /*
                   Restore each supported collection.
                */

                ANKMARK_BACKUP_KEYS.forEach(
                    key => {

                        if (
                            Array.isArray(
                                backup.data[key]
                            )
                        ) {

                            saveRecords(
                                key,
                                backup.data[key]
                            );

                        }

                    }
                );


                showToast(
                    "Backup restored successfully"
                );


                /*
                   Give the user time to see
                   the success message.
                */

                setTimeout(
                    function () {

                        location.reload();

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Backup restore error:",
                    error
                );


                showToast(
                    "Could not read this backup file"
                );

            }

        };


    reader.onerror =
        function () {

            showToast(
                "Could not open backup file"
            );

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   START
========================================================= */

openPage(
    "dashboard"
);