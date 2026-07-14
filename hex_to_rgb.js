// made by Gemini NOTHING by me

(function (Scratch) {
  'use strict';

  class HexToRGBExtension {
    getInfo() {
      return {
        id: 'hextorgb',
        name: 'Hex to RGB',
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
                defaultValue: '#ff00ff'
              }
            }
          }
        ]
      };
    }

    // Helper function to parse hex
    hexToRgbValues(hex) {
      // Remove leading # if present
      hex = hex.replace(/^#/, '');

      // Handle shorthand hex (e.g. "03F" -> "0033FF")
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }

      // Ensure we have a valid 6-character hex string
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

    // Returns "204,80,40"
    convertHexToRGB(args) {
      const rgb = this.hexToRgbValues(args.HEX);
      if (!rgb) return "0,0,0"; // Fallback for invalid inputs
      return `${rgb.r},${rgb.g},${rgb.b}`;
    }
  }

  Scratch.extensions.register(new HexToRGBExtension());
})(Scratch);
