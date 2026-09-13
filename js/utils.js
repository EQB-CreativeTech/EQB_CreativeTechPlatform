// Small color helpers shared by the theming module.
(function () {
    window.EQB_UTILS = {
        hexToRgb(hex) {
            const value = hex.replace("#", "");
            const normalized = value.length === 3
                ? value.split("").map((char) => char + char).join("")
                : value;

            const numericValue = Number.parseInt(normalized, 16);

            return {
                r: (numericValue >> 16) & 255,
                g: (numericValue >> 8) & 255,
                b: numericValue & 255
            };
        },

        mixWithWhite(hex, amount) {
            const { r, g, b } = window.EQB_UTILS.hexToRgb(hex);
            const mixed = (channel) => Math.round(channel + (255 - channel) * amount);

            return `rgb(${mixed(r)}, ${mixed(g)}, ${mixed(b)})`;
        },

        withAlpha(hex, alpha) {
            const { r, g, b } = window.EQB_UTILS.hexToRgb(hex);
            return `rgba(${r},${g},${b},${alpha})`;
        }
    };
})();
