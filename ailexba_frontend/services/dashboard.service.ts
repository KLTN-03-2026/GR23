export async function getDashboardStats() {
    const res = await fetch("https://localhost:7083/api/Dashboard/stats", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }

    return res.json();
}