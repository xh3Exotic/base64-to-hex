// made by Gemini NOTHING by me

(function (Scratch) {
  'use strict';

  class HexToRGBExtension {
    getInfo() {
      return {
        id: 'hextorgb',
        name: 'HEX to RGB',
        color1: '#cc5028', // Core block color
        color2: '#ab3e1c', // Darker shade for borders and drop-down arrows
        blocks: [
          {
            opcode: 'convertHexToRGB',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert hex [HEX] to rgb',
            arguments: {
              HEX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#ffffff'
              }
            }
          },
          {
            opcode: 'convertRGBToHex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert rgb [RGB] to hex',
            arguments: {
              RGB: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '255,255,255'
              }
            }
          }
        ]
      };
    }

    // Helper: Hex -> RGB
    hexToRgbValues(hex) {
      hex = hex.replace(/^#/, '');

      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }

      if (hex.length !== 6) {
        return null;
      }

      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return null;
      }

      return { r, g, b };
    }

    // Block 1: Hex to RGB (Returns "204,80,40")
    convertHexToRGB(args) {
      const rgb = this.hexToRgbValues(args.HEX);
      if (!rgb) return "0,0,0";
      return `${rgb.r},${rgb.g},${rgb.b}`;
    }

    // Block 2: RGB to Hex (Returns "#cc5028")
    convertRGBToHex(args) {
      // Split the input by commas and clean up spaces
      const parts = args.RGB.split(',').map(part => part.trim());

      if (parts.length !== 3) {
        return "#000000"; // Fallback for invalid input formats
      }

      // Convert parts to numbers, clamping them between 0 and 255
      const r = Math.max(0, Math.min(255, parseInt(parts[0], 10)));
      const g = Math.max(0, Math.min(255, parseInt(parts[1], 10)));
      const b = Math.max(0, Math.min(255, parseInt(parts[2], 10)));

      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return "#000000"; // Fallback for NaN cases
      }

      // Convert numbers to hex and pad with a leading zero if necessary
      const toHex = (val) => {
        const hex = val.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }

  Scratch.extensions.register(new HexToRGBExtension());
})(Scratch);
