import { GenezioDeploy, GenezioMethod } from "@genezio/types";
// import fs from "fs/promises";
import {
  ContextChatEngine,
  // Document as LlamaDocument,
  IngestionPipeline,
  KeywordExtractor,
  // LlamaParseReader,
  OpenAI,
  OpenAIEmbedding,
  // PDFReader,
  QdrantVectorStore,
  QuestionsAnsweredExtractor,
  SimpleDirectoryReader,
  SimpleNodeParser,
  SummaryExtractor,
  TitleExtractor,
  VectorStoreIndex,
} from "llamaindex";
import pg from "pg";

// import { EntityExtractor } from "./extractors";

/**
 * Chat operations.
 */
@GenezioDeploy()
export class ChatService {
  path = "./data";
  llm: OpenAI | null = null;
  chatEngine: ContextChatEngine | null = null;
  pool: pg.Pool | null = null;

  constructor() {
    this.llm = new OpenAI({
      model: "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY,
      additionalChatOptions: { response_format: { type: "json_object" } },
    });

    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
  }

  @GenezioMethod()
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
        // new EntityExtractor(),
        new OpenAIEmbedding(),
      ],
      vectorStore,
    });
    await pipeline.run({ documents });
    const retriever = index.asRetriever({ similarityTopK: 5 });

    this.chatEngine = new ContextChatEngine({ retriever });
  }

  async chat(text: string): Promise<string> {
    if (!this.chatEngine) {
      throw new Error("Chat engine not initialized");
    }

    const { response, sourceNodes } = await this.chatEngine.chat({
      message: text,
    });

    console.log("Source nodes:", sourceNodes);

    return response;
  }
}
