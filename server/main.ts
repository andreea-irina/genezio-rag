import { GenezioDeploy } from "@genezio/types";
import {
  ContextChatEngine,
  IngestionPipeline,
  KeywordExtractor,
  LlamaParseReader,
  OpenAI,
  OpenAIEmbedding,
  PDFReader,
  QdrantVectorStore,
  QuestionsAnsweredExtractor,
  SimpleDirectoryReader,
  SimpleNodeParser,
  SummaryExtractor,
  TitleExtractor,
  VectorStoreIndex,
} from "llamaindex";

import { EntityExtractor } from "./extractors";

/**
 * Chat operations.
 */
@GenezioDeploy()
export class ChatService {
  path = "./data";
  llm = new OpenAI({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
    additionalChatOptions: { response_format: { type: "json_object" } },
  });
  chatEngine: ContextChatEngine;

  constructor() {}

  async extractData() {
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
    // const doc = await new PDFReader().loadDataAsContent(arrayBuffer);
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
    this.chatEngine = new ContextChatEngine({ retriever });
  }

  async chat(text: string) {
    if (!this.chatEngine) {
      throw new Error("Chat engine not initialized");
    }

    const { response } = await this.chatEngine.chat({ message: text });

    return response;
  }
}
