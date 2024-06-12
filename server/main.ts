import { GenezioDeploy } from "@genezio/types";
import {
  IngestionPipeline,
  KeywordExtractor,
  OpenAI,
  OpenAIEmbedding,
  QdrantVectorStore,
  QuestionsAnsweredExtractor,
  SimpleDirectoryReader,
  SimpleNodeParser,
  SummaryExtractor,
  TitleExtractor,
  VectorStoreIndex,
} from "llamaindex";

import { EntityExtractor } from "./extractors";

@GenezioDeploy()
export class ChatService {
  path = "./data";
  llm = new OpenAI({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
    additionalChatOptions: { response_format: { type: "json_object" } },
  });

  constructor() {}

  async extractData() {
    const documents = await new SimpleDirectoryReader().loadData({
      directoryPath: this.path,
    });

    const vectorStore = new QdrantVectorStore({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
    const index = VectorStoreIndex.fromVectorStore(vectorStore);

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

    const nodes = await pipeline.run({ documents });
  }
}
