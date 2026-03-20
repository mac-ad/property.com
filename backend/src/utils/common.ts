

export const slugify = (text: string) => {
    const slug = text.toLowerCase().replace(/ /g, '-');
    // const datetime = new Date().toISOString().replace(/:/g, '-');
    return `${slug}`;
}


export const isNumeric = (value: string) => {
    return !isNaN(Number(value));
}