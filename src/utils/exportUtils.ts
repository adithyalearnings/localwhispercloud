import { jsPDF } from "jspdf";
import { toast } from "sonner";

// Export transcript to PDF
export const exportToPDF = (text: string, fileName = "transcript") => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Whisper Local Transcription", 20, 20);
    
    // Add timestamp
    doc.setFontSize(10);
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated: ${timestamp}`, 20, 30);
    
    // Add separator line
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    
    // Add transcript text with word wrapping
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 45);
    
    // Save the PDF
    doc.save(`${fileName}.pdf`);
    
    toast.success("PDF export successful");
  } catch (error) {
    console.error("PDF export error:", error);
    toast.error("Failed to export PDF");
  }
};

// Prepare Google Docs export
export const exportToGoogleDocs = (text: string) => {
  try {
    // Google Docs URL with prefilled content
    const encodedText = encodeURIComponent(text);
    const url = `https://docs.new?text=${encodedText}`;
    
    // Open in new tab
    window.open(url, "_blank");
    toast.success("Opening Google Docs with transcript");
  } catch (error) {
    console.error("Google Docs export error:", error);
    toast.error("Failed to export to Google Docs");
  }
};

// Prepare Google Keep export
export const exportToGoogleKeep = (text: string) => {
  try {
    // Google Keep URL with prefilled content
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent("Whisper Local Transcription");
    const url = `https://keep.new/#NOTE/${encodedTitle}/${encodedText}`;
    
    // Open in new tab
    window.open(url, "_blank");
    toast.success("Opening Google Keep with transcript");
  } catch (error) {
    console.error("Google Keep export error:", error);
    toast.error("Failed to export to Google Keep");
  }
};

// Prepare Notion export
export const exportToNotion = (text: string) => {
  try {
    // Notion doesn't have a direct prefill link, so we'll copy to clipboard
    // and open a new Notion page
    navigator.clipboard.writeText(text);
    window.open("https://notion.new", "_blank");
    
    toast.success("Text copied to clipboard. Paste it into the new Notion page");
  } catch (error) {
    console.error("Notion export error:", error);
    toast.error("Failed to prepare Notion export");
  }
};
