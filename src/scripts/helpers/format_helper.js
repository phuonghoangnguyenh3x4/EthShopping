function currency_format(n) {
    return  Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(n);
}