import { Card, CardContent } from "@/components/ui/card"
import { getChurnRate } from "@/lib/actions/analytics_action"
import ChurnRateClient from "./ChurnRateClient";



export default async function ChurnRatePage() {

    const result = await getChurnRate()

    if (!result.success) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No churn rate data found.</p>
                </CardContent>
            </Card>
        );
    }


    const churn_rate = result.data

    // console.log("churn_rate", churn_rate)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold ">Churn Rate</h1>
                    <p className="text-gray-600">Get churn rate data.</p>
                </div>
            </div>
            <ChurnRateClient data={churn_rate} />
        </div>
    );
}
