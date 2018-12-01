export const contains = (array, item) => {
    if (!array || !item) return false;
    for (let i in array) {
        if (array[i] === item) return true;
    }
    return false;
}