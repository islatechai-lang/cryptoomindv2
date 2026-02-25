import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.WHOP_API_KEY;
const companyId = "biz_zwrSfhGhKeNYS5"; // From logs

async function run() {
    if (!apiKey) {
        console.error("WHOP_API_KEY not found in environment");
        return;
    }

    const queryParams = new URLSearchParams();
    queryParams.append("company_id", companyId);
    queryParams.append("first", "20");

    const apiUrl = `https://api.whop.com/api/v1/memberships?${queryParams.toString()}`;
    console.log(`[Diagnostic] Calling Whop API: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Diagnostic] API Error ${response.status}: ${errorBody}`);
            return;
        }

        const data = await response.json() as any;
        const memberships = data.data || [];

        console.log(`[Diagnostic] API returned ${memberships.length} total memberships for company.`);

        if (memberships.length > 0) {
            console.log("[Diagnostic] First few memberships details:");
            memberships.forEach((m: any, i: number) => {
                console.log(`${i + 1}. ID: ${m.id} | Plan: ${m.plan?.id} | Status: ${m.status} | Product: ${m.product?.title}`);
            });
        } else {
            console.log("[Diagnostic] No memberships found even without filters.");
        }

    } catch (error) {
        console.error("[Diagnostic] Fetch failed:", error);
    }
}

run();
