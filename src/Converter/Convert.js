export default function FormatNumber(num) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
