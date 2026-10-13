const waitTable = document.getElementById("faq-wait-table");
if (waitTable) {
    const hour = new Date().getHours();
    const rows = waitTable.querySelectorAll("tbody tr");
 
    rows.forEach(function (row) {
        const times = row.querySelector("th").textContent.match(/(\d+):00\D+(\d+):00/);
        if (times && hour >= Number(times[1]) && hour < Number(times[2])) {
            row.classList.add("table-primary");
        }
    });
}