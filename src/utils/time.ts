export function isValidDateTime(time: Date | null): boolean{
    if(!time) return false;

    return time.toString() !== "Invalid Date";
}