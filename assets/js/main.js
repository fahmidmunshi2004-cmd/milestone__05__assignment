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

// Header elements
const headerTitle = document.querySelector(".text-xl.font-bold"); // 50 Issues
const tabs = document.querySelectorAll(".tab-btn");

let allIssues = [];

// ================= LOAD ALL ISSUES =================
async function loadIssues() {
    showLoader();

    try {
        const res = await fetch(API);
        const data = await res.json();
        allIssues = data.data;

        displayIssues(allIssues);
        updateHeaderCount(allIssues); // initial header
    } catch (err) {
        console.error("Error loading issues:", err);
        issueContainer.innerHTML = `<p class="col-span-4 text-center text-red-500 py-10">Failed to load issues.</p>`;
    }

    hideLoader();
}

// ================= UPDATE HEADER COUNT =================
function updateHeaderCount(issues) {
    headerTitle.textContent = `${issues.length} Issues`;
}

// ================= DISPLAY ISSUES =================
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

// ================= SEARCH =================
searchBtn.addEventListener("click", () => {
    const text = searchInput.value.trim().toLowerCase();
    if (!text) return displayIssues(allIssues);

    const filtered = allIssues.filter(issue =>
        issue.title.toLowerCase().includes(text) ||
        issue.description.toLowerCase().includes(text)
    );

    displayIssues(filtered);
    updateHeaderCount(filtered); // Update header
});

// ================= TABS =================
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab");

        // Tab styling
        tabs.forEach(t => {
            t.classList.remove("bg-[#4A00FF]", "text-white");
            t.classList.add("bg-white", "text-[#5E6C84]");
        });
        tab.classList.add("bg-[#4A00FF]", "text-white");
        tab.classList.remove("bg-white", "text-[#5E6C84]");

        // Filter issues by tab
        let filtered = tabName === "all" ? allIssues : allIssues.filter(issue => issue.status === tabName);

        displayIssues(filtered);
        updateHeaderCount(filtered); // Update header count
    });
});

// ================= MODAL =================
async function openModal(id) {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;

        const modal = document.createElement("div");
        modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

        modal.innerHTML = `
            <div class="bg-white w-[500px] p-6 rounded-lg relative">
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="absolute right-4 top-4 text-xl">✕</button>

                <h2 class="text-2xl font-bold mb-4">${issue.title}</h2>
                <p class="mb-4 text-gray-600">${issue.description}</p>
                <p><strong>Status:</strong> ${issue.status}</p>
                <p><strong>Priority:</strong> ${issue.priority}</p>
                <p><strong>Author:</strong> ${issue.author}</p>
                <p><strong>Date:</strong> ${issue.createdAt}</p>
            </div>
        `;

        document.body.appendChild(modal);
    } catch (err) {
        console.error("Failed to open modal:", err);
        alert("Failed to load issue details.");
    }
}

// ================= LOADER =================
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