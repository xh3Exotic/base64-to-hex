(function (Scratch) {
  "use strict";

  class HexBase64Converter {
    getInfo() {
      return {
        id: "hexbase64converter",
        name: "Image Hex & Base64 (Transparent)",
        // Custom color theme
        color1: "#8cda3e", // Primary block color (your requested color)
        color2: "#77ba32", // Slightly darker shade for borders/inputs
        blocks: [
          {
            opcode: "convertBase64ToHexJson",
            blockType: Scratch.BlockType.REPORTER,
            text: "convert base64 [BASE64] to hex JSON",
            arguments: {
              BASE64: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2P8z8AARAwMjEDAgCQPAASoAgc5g85RAAAAAElFTkSuQmCC",
              },
            },
          },
          {
            opcode: "convertHexJsonToBase64",
            blockType: Scratch.BlockType.REPORTER,
            text: "convert hex JSON [JSON_STR] to base64",
            arguments: {
              JSON_STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:
                  '{"width":2,"height":2,"pixels":["#FF000080","#00FF00FF","#0000FF00","#FFFFFF66"]}',
              },
            },
          },
        ],
      };
    }

    // --- Block 1: Base64 -> Hex JSON ---
    convertBase64ToHexJson(args) {
      let base64String = args.BASE64.trim();

      if (!base64String.startsWith("data:image/")) {
        base64String = "data:image/png;base64," + base64String;
      }

      return new Promise((resolve) => {
        const img = new Image();

        img.onload = function () {
          const width = img.width;
          const height = img.height;

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, width, height).data;
          const hexPixels = [];

          for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];

            let hex = "#";
            hex += ((1 << 24) + (r << 16) + (g << 8) + b)
              .toString(16)
              .slice(1)
              .toUpperCase();

            if (a < 255) {
              const alphaHex = a.toString(16).padStart(2, "0").toUpperCase();
              hex += alphaHex;
            }

            hexPixels.push(hex);
          }

          const resultJson = {
            width: width,
            height: height,
            pixels: hexPixels,
          };

          resolve(JSON.stringify(resultJson));
        };

        img.onerror = function () {
          resolve(JSON.stringify({ error: "Invalid image or Base64 string" }));
        };

        img.src = base64String;
      });
    }

    // --- Block 2: Hex JSON -> Base64 ---
    convertHexJsonToBase64(args) {
      try {
        const data = JSON.parse(args.JSON_STR);

        if (!data.width || !data.height || !Array.isArray(data.pixels)) {
          return "Error: Invalid JSON format. Needs 'width', 'height', and 'pixels' array.";
        }

        const width = parseInt(data.width, 10);
        const height = parseInt(data.height, 10);
        const pixels = data.pixels;

        if (pixels.length !== width * height) {
          return `Error: Pixel array length (${pixels.length}) does not match dimensions (${width}x${height} = ${width * height})`;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const imgData = ctx.createImageData(width, height);

        const hexToRgba = (hex) => {
          const cleanHex = hex.replace(/^#/, "");

          let r = 0,
            g = 0,
            b = 0,
            a = 255;

          if (cleanHex.length === 6) {
            const bigint = parseInt(cleanHex, 16);
            r = (bigint >> 16) & 255;
            g = (bigint >> 8) & 255;
            b = bigint & 255;
          } else if (cleanHex.length === 8) {
            const bigint = parseInt(cleanHex, 16);
            r = (bigint >> 24) & 255;
            g = (bigint >> 16) & 255;
            b = (bigint >> 8) & 255;
            a = bigint & 255;
          } else if (cleanHex.length === 3) {
            r = parseInt(cleanHex[0] + cleanHex[0], 16);
            g = parseInt(cleanHex[1] + cleanHex[1], 16);
            b = parseInt(cleanHex[2] + cleanHex[2], 16);
          } else if (cleanHex.length === 4) {
            r = parseInt(cleanHex[0] + cleanHex[0], 16);
            g = parseInt(cleanHex[1] + cleanHex[1], 16);
            b = parseInt(cleanHex[2] + cleanHex[2], 16);
            a = parseInt(cleanHex[3] + cleanHex[3], 16);
          }

          return { r, g, b, a };
        };

        for (let i = 0; i < pixels.length; i++) {
          const hexColor = pixels[i] || "#00000000";
          const rgba = hexToRgba(hexColor);
          const dataIndex = i * 4;

          imgData.data[dataIndex] = rgba.r;
          imgData.data[dataIndex + 1] = rgba.g;
          imgData.data[dataIndex + 2] = rgba.b;
          imgData.data[dataIndex + 3] = rgba.a;
        }

        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL("image/png");
      } catch (e) {
        return "Error parsing JSON: " + e.message;
      }
    }
  }

  Scratch.extensions.register(new HexBase64Converter());
})(Scratch);
