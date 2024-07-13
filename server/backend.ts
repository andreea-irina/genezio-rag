import { GenezioDeploy, GenezioMethod } from "@genezio/types";
// import fs from "fs/promises";
import {
  CohereRerank,
  // Document as LlamaDocument,
  IngestionPipeline,
  KeywordExtractor,
  // LlamaParseReader,
  OpenAI,
  OpenAIEmbedding,
  // PDFReader,
  QdrantVectorStore,
  QuestionsAnsweredExtractor,
  ResponseSynthesizer,
  RetrieverQueryEngine,
  SimpleDirectoryReader,
  SimpleNodeParser,
  SummaryExtractor,
  TitleExtractor,
  VectorStoreIndex,
} from "llamaindex";
import pg from "pg";

import { EntityExtractor } from "./extractors";

/**
 * Chat operations.
 */
@GenezioDeploy()
export class ChatService {
  path = "./data";
  llm: OpenAI | null = null;
  queryEngine: RetrieverQueryEngine | null = null;
  pool: pg.Pool | null = null;

  constructor() {
    this.llm = new OpenAI({
      model: "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // this.pool = new pg.Pool({
    //   connectionString: process.env.DATABASE_URL,
    //   ssl: true,
    // });
  }

  async extractData(base64PDF?: string): Promise<void> {
    // const pdfBuffer = Buffer.from(base64PDF, "base64");
    // const { text: pdfText } = await PdfParse(pdfBuffer);
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: this.path,
    });
    // const test = await new LlamaParseReader({
    //   apiKey: process.env.LLAMA_CLOUD_API_KEY,
    //   baseUrl: "https://pdfobject.com/pdf/sample.pdf",
    //   gpt4oMode: true,
    //   gpt4oApiKey: process.env.OPENAI_API_KEY,
    // }).loadData(".");
    // console.log(test);
    // const doc = await new LlamaDocument({ text: pdfText });
    // console.log(doc);
    const vectorStore = new QdrantVectorStore({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
    const index = await VectorStoreIndex.fromVectorStore(vectorStore);
    const pipeline = new IngestionPipeline({
      transformations: [
        new SimpleNodeParser({ chunkSize: 1024, chunkOverlap: 20 }),
        new TitleExtractor(),
        new KeywordExtractor(),
        new SummaryExtractor(),
        new QuestionsAnsweredExtractor(),
        new EntityExtractor(),
        new OpenAIEmbedding(),
      ],
      vectorStore,
    });
    await pipeline.run({ documents });
    const retriever = index.asRetriever({ similarityTopK: 5 });

    const nodePostprocessor = new CohereRerank({
      apiKey: process.env.COHERE_API_KEY || "",
      topN: 4,
    });
    const responseSynthesizer = new ResponseSynthesizer();

    this.queryEngine = index.asQueryEngine({
      retriever,
      nodePostprocessors: [nodePostprocessor],
      responseSynthesizer,
    });
  }

  @GenezioMethod()
  async chat(text: string): Promise<string> {
    if (!this.queryEngine) {
      throw new Error("Query engine not initialized");
    }

    const intention = await this.detectIntention(text);
    console.log(`Detected intention: ${intention}`);

    const { response } = await this.queryEngine.query({
      query: `Answer the following query using the provided document: "${text}". This is the intent detected: "${intention}". If the document does not contain the answer, please let me know and don't provide an answer.`,
    });

    console.log(`Response: ${response}`);

    return response;
  }

  @GenezioMethod()
  async detectIntention(query: string) {
    const response = await this.llm?.chat({
      messages: [
        {
          role: "user",
          content: `What is the intention behind this query: "${query}"?`,
        },
      ],
    });

    const intention = response?.message.content;
    return intention || "unknown";
  }
}
