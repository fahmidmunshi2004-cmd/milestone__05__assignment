const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => {
            t.classList.remove("bg-[#4A00FF]", "text-white");
            t.classList.add("bg-white", "text-[#5E6C84]");
        });

        tab.classList.add("bg-[#4A00FF]", "text-white");
        tab.classList.remove("bg-white", "text-[#5E6C84]");
    });
});