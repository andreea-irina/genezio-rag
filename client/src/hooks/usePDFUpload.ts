import * as React from "react";

export const usePDFUpload = () => {
  const [file, setFile] = React.useState<File | null>(null);

  async function readPDF(data: Uint8Array): Promise<{
    totalPages: number;
    text: string[];
  }> {
    const { extractText } = await import("unpdf");
    return (await extractText(data)) as {
      totalPages: number;
      text: string[];
    };
  }

  async function loadData(content: Uint8Array): Promise<Document[]> {
    const { totalPages, text } = await readPDF(content);
    return text.map((text, page) => {
      const metadata = {
        page_number: page + 1,
        total_pages: totalPages,
      };
      return new Document({ text, metadata });
    });
  }
};
