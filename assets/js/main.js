window.addEventListener("load", () => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
        window.location.href = "login.html";
    }
});

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const issueContainer = document.querySelector(".grid");
const searchInput = document.querySelector("input[placeholder='Search issues...']");
const searchBtn = document.querySelector(".search button");

// Header elements //
const headerTitle = document.querySelector(".text-xl.font-bold");
const tabs = document.querySelectorAll(".tab-btn");

let allIssues = [];

// ================= LOAD ALL ISSUES ================= //
async function loadIssues() {
    showLoader();

    try {
        const res = await fetch(API);
        const data = await res.json();
        allIssues = data.data;

        displayIssues(allIssues);
        updateHeaderCount(allIssues);
    } catch (err) {
        console.error("Error loading issues:", err);
        issueContainer.innerHTML = `<p class="col-span-4 text-center text-red-500 py-10">Failed to load issues.</p>`;
    }

    hideLoader();
}

// ================= UPDATE HEADER COUNT ================= //
function updateHeaderCount(issues) {
    headerTitle.textContent = `${issues.length} Issues`;
}

// ================= DISPLAY ISSUES ================= //
function displayIssues(issues) {
    issueContainer.innerHTML = "";

    issues.forEach(issue => {
        const borderColor = issue.status === "open" ? "#00A96E" : "#A855F7";

        const card = document.createElement("div");
        card.className = "col-span-1";
        card.innerHTML = `
        <div onclick="openModal(${issue.id})"
             class="max-w-[350px] h-full cursor-pointer bg-white rounded-xl shadow-[0_1px_6px_0_rgba(0,0,0,0.08)] overflow-hidden border-t-[3px] ${borderColor === '#00A96E' ? 'border-[#00A96E]' : 'border-[#A855F7]'}">
        
            <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-8 h-8 rounded-full ${issue.status === 'open' ? 'bg-[#E6F6EF]' : 'bg-[#f0e2ff]'} flex items-center justify-center">
                        <img src="${issue.status === 'open' ? './assets/img/icon/icon-01.png' : './assets/img/icon/check.png'}" alt="">
                    </div>
                    <span class="px-5 py-1.5 bg-[#fff6d1] text-[#f59e0b] text-xs font-bold rounded-full">
                        ${issue.priority}
                    </span>
                </div>

                <h3 class="text-[18px] font-bold text-[#1E293B] leading-tight mb-2">${issue.title}</h3>

                <p class="text-[#64748B] text-sm leading-relaxed mb-5">
                    ${issue.description.slice(0, 80)}...
                </p>

                <div class="flex items-center gap-2">
                    ${issue.labels.map(label => `
                        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9E6] border border-[#FFECB3] rounded-full">
                            <span class="text-[#D97706] text-[10px] font-bold uppercase">${label}</span>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="px-6 py-5 border-t border-gray-100">
                <div class="flex flex-col gap-1.5">
                    <p class="text-[#64748B] text-[13px]">#${issue.id} by <span class="font-medium">${issue.author}</span></p>
                    <p class="text-[#64748B] text-[13px]">${issue.createdAt}</p>
                </div>
            </div>
        </div>
        `;

        issueContainer.appendChild(card);
    });
}

// ================= TABS ================= //
searchBtn.addEventListener("click", () => {
    const text = searchInput.value.trim().toLowerCase();
    if (!text) return displayIssues(allIssues);

    const filtered = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(text) ||
        issue.description.toLowerCase().includes(text) 
    );

    displayIssues(filtered);
    updateHeaderCount(filtered);
});

// ================= TABS =================//
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab");

        // Tab styling //
        tabs.forEach(t => {
            t.classList.remove("bg-[#4A00FF]", "text-white");
            t.classList.add("bg-white", "text-[#5E6C84]");
        });
        tab.classList.add("bg-[#4A00FF]", "text-white");
        tab.classList.remove("bg-white", "text-[#5E6C84]");

        // Filter issues by tab //
        let filtered = tabName === "all" ? allIssues : allIssues.filter(issue => issue.status === tabName);

        displayIssues(filtered);
        updateHeaderCount(filtered); 
    });
});

// ================= MODAL ================= //
async function openModal(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;

        const modal = document.createElement("div");

        modal.innerHTML = `
<div class="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
    <div class="bg-white w-full max-w-[700px] rounded-2xl shadow-lg p-8 relative">
        
        <h2 class="text-[28px] font-bold text-[#1E293B] mb-4">${issue.title}</h2>

        <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 ${issue.status === 'open' ? 'bg-[#00A96E] text-white' : 'bg-[#A855F7] text-white'} text-sm font-medium rounded-full flex items-center">
                ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </span>
            <span class="text-[#64748B] text-sm flex items-center gap-2">
                <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                Opened by ${issue.author}
                <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                ${issue.createdAt}
            </span>
        </div>

        <div class="flex items-center gap-3 mb-8">
            ${issue.labels.map(label => `
            <div class="flex items-center gap-1.5 px-3 py-1 ${label === 'Bug' ? 'bg-[#FFF0F0] border-[#FFDADA]' : 'bg-[#FFF9E6] border-[#FFECB3]'} border rounded-full">
                <span class="text-xs">${label === 'Bug' ? '👹' : '⚙️'}</span>
                <span class="text-[11px] font-bold uppercase tracking-wider ${label === 'Bug' ? 'text-[#FF5A5F]' : 'text-[#D97706]'}">${label}</span>
            </div>
            `).join("")}
        </div>

        <p class="text-[#64748B] text-lg leading-relaxed mb-10">
            ${issue.description}
        </p>

        <div class="bg-[#F8FAFC] rounded-2xl p-6 flex items-start gap-32 mb-8">
            <div class="space-y-2">
                <p class="text-[#64748B] text-lg">Assignee:</p>
                <p class="text-[#1E293B] font-bold text-xl">${issue.author}</p>
            </div>
            <div class="space-y-3">
                <p class="text-[#64748B] text-lg">Priority:</p>
                <span class="px-4 py-1.5 ${issue.priority === 'HIGH' ? 'bg-[#EF4444] text-white shadow-red-200' : 'bg-[#F59E0B] text-white shadow-yellow-200'} text-xs font-bold rounded-lg shadow-sm">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
        </div>

        <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" 
                class="bg-[#4F00FF] hover:bg-[#4300D9] text-white font-bold py-3 px-10 rounded-xl transition-all text-lg shadow-md shadow-indigo-100">
                Close
            </button>
        </div>
    </div>
</div>
`;

        document.body.appendChild(modal);
    } catch (err) {
        console.error("Failed to open modal:", err);
        alert("Failed to load issue details.");
    }
}

// ================= LOADER ================= //
function showLoader() {
    issueContainer.innerHTML = `
        <div class="col-span-4 flex justify-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
        </div>
    `;
}
function hideLoader() { }

loadIssues();


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        window.location.href = "login.html";
    });
}