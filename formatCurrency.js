// Instead of repeating same manual formatting code both on cart and store,
// ...using built-in JS Intl object turned out to be much better
const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "TRY",
});

export default function formatCurrency(amount) {
    return formatter.format(amount);
}
