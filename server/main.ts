import { GenezioDeploy } from "@genezio/types";

@GenezioDeploy()
@GenezioDeploy()
export class HelloWorldClass {
  hello(name: string): string {
    console.log("DEBUG: Call hello method");
    return "Hello " + name;
  }
}
