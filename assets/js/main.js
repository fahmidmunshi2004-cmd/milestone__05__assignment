const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const issueContainer = document.querySelector(".grid");
const searchInput = document.querySelector("input[placeholder='Search issues...']");
const searchBtn = document.querySelector(".search button");
const tabs = document.querySelectorAll(".tab-btn");

let allIssues = [];

// ================= LOAD ALL ISSUES =================
async function loadIssues() {
    showLoader();

    try {
        const res = await fetch(API);
        const data = await res.json();
        allIssues = data.data;

        updateTabsCount();
        displayIssues(allIssues);
    } catch (err) {
        console.error("Error loading issues:", err);
        issueContainer.innerHTML = `<p class="col-span-4 text-center text-red-500 py-10">Failed to load issues.</p>`;
    }

    hideLoader();
}

// ================= UPDATE TABS COUNT =================
function updateTabsCount() {
    const allCount = allIssues.length;
    const openCount = allIssues.filter(i => i.status === "open").length;
    const closedCount = allIssues.filter(i => i.status === "closed").length;

    tabs.forEach(tab => {
        const type = tab.dataset.tab;
        if(type === "all") tab.innerText = `All (${allCount})`;
        if(type === "open") tab.innerText = `Open (${openCount})`;
        if(type === "closed") tab.innerText = `Closed (${closedCount})`;
    });
}

// ================= DISPLAY ISSUES =================
function displayIssues(issues) {
    issueContainer.innerHTML = "";

    issues.forEach(issue => {
        const borderColor = issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]";
        const statusColor = issue.status === "open" ? "#00A96E" : "#A855F7";

        const card = document.createElement("div");
        card.className = "col-span-1";

        card.innerHTML = `
        <div onclick="openModal(${issue.id})" class="max-w-[350px] cursor-pointer bg-white rounded-xl shadow-[0_1px_6px_0_rgba(0,0,0,0.08)] overflow-hidden border-t-[3px] ${borderColor}">
            <div class="flex items-center justify-between py-6 px-4 bg-white border-b border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-[#F0E9FF] rounded-full flex items-center justify-center">
                        <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.0456 3.95376C21.1576 2.06583 18.7521 0.780171 16.1334 0.259341C13.5147 -0.261489 10.8003 0.00590718 8.33357 1.02772C5.86682 2.04952 3.75846 3.77985 2.2751 5.9999C0.791739 8.21994 0 10.83 0 13.5C0 16.17 0.791739 18.7801 2.2751 21.0001C3.75846 23.2202 5.86682 24.9505 8.33357 25.9723C10.8003 26.9941 13.5147 27.2615 16.1334 26.7407C18.7521 26.2198 21.1576 24.9342 23.0456 23.0463C24.3086 21.7979 25.3113 20.3113 25.9957 18.6727C26.68 17.034 27.0324 15.2758 27.0324 13.5C27.0324 11.7242 26.68 9.96601 25.9957 8.32735C25.3113 6.68869 24.3086 5.20212 23.0456 3.95376ZM20.9206 6.07876C21.324 6.4801 21.6939 6.91361 22.0269 7.37501L18.6194 11.3863L15.7069 3.23501C17.6839 3.65669 19.496 4.64329 20.9231 6.07501L20.9206 6.07876ZM6.06438 6.07876C7.77694 4.35752 10.0364 3.28771 12.4531 3.05376L14.2231 8.01001L5.70813 6.45126C5.82438 6.32376 5.94313 6.19876 6.06688 6.07501L6.06438 6.07876ZM3.49438 16.7125C2.70242 14.2335 2.85377 11.5493 3.91938 9.17501L9.09938 10.125L3.49438 16.7125ZM6.06313 20.925C5.66142 20.5222 5.29312 20.0875 4.96188 19.625L8.36938 15.6138L11.2819 23.765C9.30532 23.343 7.49371 22.3565 6.06688 20.925H6.06313ZM10.6081 12.9738L12.5056 10.7425L15.3881 11.2688L16.3731 14.0263L14.4769 16.2575L11.5944 15.7313L10.6081 12.9738ZM20.9194 20.925C19.2065 22.6458 16.9473 23.7155 14.5306 23.95L12.7631 19L21.2806 20.555C21.1644 20.6763 21.0456 20.8013 20.9231 20.925H20.9194ZM17.8894 16.875L23.4944 10.2875C24.2865 12.7666 24.1347 15.451 23.0681 17.825L17.8894 16.875Z" fill="#4A00FF"/>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-[#1E293B]">${issue.title}</h2>
                        <p class="text-[#64748B] text-sm">${issue.description.slice(0,50)}...</p>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full" style="background:${statusColor}"></span>
                        <span class="text-[#1E293B] font-medium">${issue.status}</span>
                    </div>
                </div>
            </div>

            <div class="p-4">
                <div class="flex justify-between mb-2">
                    <span class="text-sm font-bold uppercase">${issue.priority}</span>
                    <span class="text-xs font-bold">#${issue.id}</span>
                </div>
                <div class="flex gap-2 mb-2">
                    ${issue.labels.map(label => `<span class="px-3 py-1 text-xs border rounded-full">${label}</span>`).join("")}
                </div>
                <p class="text-sm text-gray-500">By <span class="font-medium">${issue.author}</span> | ${issue.createdAt}</p>
            </div>
        </div>
        `;

        issueContainer.appendChild(card);
    });
}

// ================= FILTER TABS =================
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("bg-[#4A00FF]", "text-white"));
        tabs.forEach(t => t.classList.add("bg-white", "text-[#5E6C84]"));

        tab.classList.add("bg-[#4A00FF]", "text-white");
        tab.classList.remove("bg-white", "text-[#5E6C84]");

        const tabType = tab.dataset.tab;
        if(tabType === "all") displayIssues(allIssues);
        if(tabType === "open") displayIssues(allIssues.filter(i => i.status === "open"));
        if(tabType === "closed") displayIssues(allIssues.filter(i => i.status === "closed"));
    });
});

// ================= SEARCH =================
searchBtn.addEventListener("click", searchIssues);

async function searchIssues() {
    const text = searchInput.value.trim();
    if (!text) {
        displayIssues(allIssues);
        return;
    }

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const data = await res.json();
        displayIssues(data.data);
    } catch (err) {
        console.error("Search failed:", err);
        issueContainer.innerHTML = `<p class="col-span-4 text-center text-red-500 py-10">Search failed.</p>`;
    }
}

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

function hideLoader() {}

// ================= START =================
loadIssues();