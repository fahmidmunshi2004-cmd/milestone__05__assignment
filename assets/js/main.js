window.addEventListener("load", () => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
        window.location.href = "login.html";
    }
});

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const issueContainer = document.querySelector(".grid");
const searchInput = document.querySelector("input[placeholder='Search issues...']");
const searchBtn = document.querySelector(".search button");

const headerTitle = document.querySelector(".text-xl.font-bold");
const tabs = document.querySelectorAll(".tab-btn");

let allIssues = [];

// ================= LOAD ISSUES ================= //
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
        issueContainer.innerHTML =
            `<p class="col-span-4 text-center text-red-500 py-10">
            Failed to load issues.
            </p>`;
    }
}

// ================= UPDATE HEADER ================= //
function updateHeaderCount(issues) {
    headerTitle.textContent = `${issues.length} Issues`;
}

// ================= DISPLAY ISSUES ================= //
function displayIssues(issues) {

    issueContainer.innerHTML = "";

    issues.forEach(issue => {

        const card = document.createElement("div");
        card.className = "col-span-1";

        card.innerHTML = `
        <div onclick="openModal(${issue.id})"
        class="h-full flex flex-col justify-between cursor-pointer bg-white rounded-xl shadow-[0_1px_6px_0_rgba(0,0,0,0.08)] overflow-hidden border-t-[3px] ${issue.status === 'open' ? 'border-[#00A96E]' : 'border-[#A855F7]'}">

            <div class="p-4">

                <div class="flex items-center justify-between mb-4">

                    <div class="w-8 h-8 rounded-full ${issue.status === 'open' ? 'bg-[#E6F6EF]' : 'bg-[#f0e2ff]'} flex items-center justify-center">
                        <img src="${issue.status === 'open' ? './assets/img/icon/icon-01.png' : './assets/img/icon/check.png'}">
                    </div>

                    <span class="px-5 py-1.5 bg-[#fff6d1] text-[#f59e0b] text-xs font-bold rounded-full">
                        ${issue.priority}
                    </span>

                </div>

                <h3 class="text-[14px] font-bold text-[#1E293B] mb-2">
                ${issue.title}
                </h3>

                <p class="text-[#64748B] text-[12px] mb-5">
                ${issue.description.slice(0, 80)}...
                </p>

                <div class="flex items-center gap-2">
                    ${issue.labels.map(label => `
                        <div class="px-3 bg-[#FFF9E6] border border-[#FFECB3] rounded-full">
                        <span class="text-[#D97706] text-[10px] font-bold uppercase">${label}</span>
                        </div>
                    `).join("")}
                </div>

            </div>

            <div class="px-6 py-5 border-t border-gray-100">
                <p class="text-[#64748B] text-[13px]">
                #${issue.id} by <span class="font-medium">${issue.author}</span>
                </p>
                <p class="text-[#64748B] text-[13px]">${issue.createdAt}</p>
            </div>

        </div>
        `;

        issueContainer.appendChild(card);

    });
}

// ================= SEARCH ================= //
searchBtn.addEventListener("click", () => {

    const text = searchInput.value.trim().toLowerCase();

    if (!text) {
        displayIssues(allIssues);
        updateHeaderCount(allIssues);
        return;
    }

    const filtered = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(text) ||
        issue.description.toLowerCase().includes(text)
    );

    displayIssues(filtered);
    updateHeaderCount(filtered);

});

// ENTER KEY SEARCH //
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// ================= TABS ================= //
tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const tabName = tab.getAttribute("data-tab");

        tabs.forEach(t => {
            t.classList.remove("bg-[#4A00FF]", "text-white");
            t.classList.add("bg-white", "text-[#5E6C84]");
        });

        tab.classList.add("bg-[#4A00FF]", "text-white");
        tab.classList.remove("bg-white", "text-[#5E6C84]");

        const filtered = tabName === "all"
            ? allIssues
            : allIssues.filter(issue => issue.status === tabName);

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
        <div id="modalOverlay" class="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 transition-opacity duration-300">

            <div id="modalBox" class="bg-white w-full max-w-[500px] h-max rounded-2xl shadow-lg p-5 relative transform transition-all duration-300 scale-100">

                <h2 class="text-[24px] font-bold text-[#1E293B] mb-4">
                    ${issue.title}
                </h2>

                <div class="flex items-center gap-3 mb-6">
                    <span class="px-3 py-1 ${issue.status === 'open' ? 'bg-[#00A96E]' : 'bg-[#A855F7]'} text-white text-sm font-medium rounded-full">
                        ${issue.status}
                    </span>

                    <span class="text-[#64748B] text-sm flex items-center gap-2">
                        <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                        Opened by ${issue.author}
                        <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                        ${issue.createdAt}
                    </span>
                </div>

                <div class="flex items-center gap-3 mb-4">
                    ${issue.labels.map(label => `
                    <div class="flex items-center gap-1.5 px-3 py-1 bg-[#FFF9E6] border border-[#FFECB3] rounded-full">
                        <span class="text-[#D97706] text-xs">
                        <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                        <path fill="#EF4444"/>
                        </svg>
                        </span>

                        <span class="text-[#D97706] text-[11px] font-bold uppercase tracking-wider">
                            ${label}
                        </span>
                    </div>
                    `).join("")}
                </div>

                <p class="text-[#64748B] text-lg leading-relaxed mb-4">
                    ${issue.description}
                </p>

                <div class="bg-[#F8FAFC] rounded-2xl p-2 flex items-start gap-32 mb-4">

                    <div class="space-y-2">
                        <p class="text-[#64748B] text-lg">Assignee:</p>
                        <p class="text-[#1E293B] font-bold text-base">
                            ${issue.author}
                        </p>
                    </div>

                    <div class="space-y-3">
                        <p class="text-[#64748B] text-lg">Priority:</p>

                        <span class="px-4 py-1.5 
                        ${issue.priority === 'HIGH' ? 'bg-[#EF4444]' :
                issue.priority === 'MEDIUM' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}
                        text-white text-xs font-bold rounded-lg shadow-sm">

                        ${issue.priority}

                        </span>
                    </div>

                </div>

                <div class="flex justify-end">

                    <button id="closeBtn"
                    class="bg-[#4F00FF] h-[44px] hover:bg-[#4300D9] text-white font-bold px-10 rounded-xl transition-all text-lg shadow-md shadow-indigo-100">

                    Close

                    </button>

                </div>

            </div>

        </div>
        `;

        document.body.appendChild(modal);

        const overlay = modal.querySelector("#modalOverlay");
        const box = modal.querySelector("#modalBox");
        const closeBtn = modal.querySelector("#closeBtn");

        function closeModal() {

            overlay.classList.add("opacity-0");
            box.classList.add("scale-95");

            setTimeout(() => {
                modal.remove();
            }, 300);
        }

        closeBtn.addEventListener("click", closeModal);

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

    } catch (err) {

        console.error("Modal error:", err);
        alert("Failed to load issue");

    }

}

// ================= LOADER ================= //
function showLoader() {

    issueContainer.innerHTML = `
    <div class="col-span-4 flex justify-center items-center py-24">

    <div class="flex flex-col items-center gap-4">

    <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#4A00FF] border-t-transparent"></div>

    <p class="text-gray-500 text-sm">
    Loading Issues...
    </p>

    </div>

    </div>
    `;
}

// ================= LOGOUT ================= //
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        sessionStorage.removeItem("loggedIn");
        window.location.href = "login.html";

    });

}

// START //
loadIssues();