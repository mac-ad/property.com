

export const slugify = (text: string) => {
    const slug = text.toLowerCase().replace(/ /g, '-');
    // const datetime = new Date().toISOString().replace(/:/g, '-');
    return `${slug}`;
}


export const isNumeric = (value: string) => {
    return value.trim() !== '' && !isNaN(Number(value));
}