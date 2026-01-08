export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Calculate subscription progress
export const subscriptionProgress = () => {
    const start = new Date(franchise.subscription.startDate)
    const end = new Date(franchise.subscription.endDate)
    const now = new Date()
    const total = end - start
    const elapsed = now - start
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

// Calculate days remaining
export const daysRemaining = () => {
    const end = new Date(franchise.subscription.endDate)
    const now = new Date()
    const diff = end - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}