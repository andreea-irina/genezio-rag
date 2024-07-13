import {
  BaseExtractor,
  BaseNode,
  LLM,
  MetadataMode,
  OpenAI,
  TextNode,
} from "llamaindex";

type EntityExtractArgs = {
  llm?: LLM;
  entities?: number;
};

const entityExtractorPromptTemplate = (
  contextStr = "",
  entities = 5
) => `${contextStr}
Give ${entities} unique entities for this document.
Format as comma separated.
Entities: `;

/**
 * Extract entities from a list of nodes.
 */
export class EntityExtractor extends BaseExtractor {
  /**
   * LLM instance.
   * @type {LLM}
   */
  llm: LLM;

  /**
   * Number of entities to extract.
   * @type {number}
   * @default 5
   */
  entities: number = 5;

  /**
   * Constructor for the EntityExtractor class.
   * @param {LLM} llm LLM instance.
   * @param {number} entities Number of entities to extract.
   * @throws {Error} If entities is less than 1.
   */
  constructor(options?: EntityExtractArgs) {
    if (options?.entities && options.entities < 1)
      throw new Error("Entities must be greater than 0");

    super();

    this.llm = options?.llm ?? new OpenAI();
    this.entities = options?.entities ?? 5;
  }

  /**
   *
   * @param node Node to extract entities from.
   * @returns Entitites extracted from the node.
   */
  async extractEntititesFromNodes(node: BaseNode) {
    if (this.isTextNodeOnly && !(node instanceof TextNode)) {
      console.log("here");
      return {};
    }

    const completion = await this.llm.complete({
      prompt: entityExtractorPromptTemplate(
        node.getContent(MetadataMode.ALL),
        this.entities
      ),
    });

    return {
      excerptEntitites: completion.text,
    };
  }

  /**
   *
   * @param nodes Nodes to extract entities from.
   * @returns Entitites extracted from the nodes.
   */
  async extract(nodes: BaseNode[]) {
    const results = await Promise.all(
      nodes.map((node) => this.extractEntititesFromNodes(node))
    );
    return results;
  }
}
