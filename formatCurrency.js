const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "TRY",
});

export default function formatCurrency(amount) {
    return formatter.format(amount);
}
