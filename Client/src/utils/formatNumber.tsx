export function formatCount(count: number): string {
    if (count >= 1_000_000) {
        return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // 1M format
    } else if (count >= 1_000) {
        return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // 1K format
    }
    return count.toString(); 
}
