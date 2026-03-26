import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

import {
  A4_EXPORT_HEIGHT_PX,
  A4_EXPORT_WIDTH_PX,
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
} from "./a4";

const downloadFile = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const createImageDataUrl = async (node: HTMLElement) => {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    backgroundColor: "#ffffff",
    width: node.offsetWidth,
    height: node.offsetHeight,
    canvasWidth: A4_EXPORT_WIDTH_PX,
    canvasHeight: A4_EXPORT_HEIGHT_PX,
    filter: (element) =>
      !(element instanceof HTMLElement && element.dataset.exportIgnore === "true"),
  });
};

export const exportResumeAsPng = async (
  node: HTMLElement,
  filename: string,
) => {
  const dataUrl = await createImageDataUrl(node);
  downloadFile(dataUrl, `${filename}.png`);
};

export const exportResumeAsPdf = async (
  node: HTMLElement,
  filename: string,
) => {
  const dataUrl = await createImageDataUrl(node);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  pdf.save(`${filename}.pdf`);
};
