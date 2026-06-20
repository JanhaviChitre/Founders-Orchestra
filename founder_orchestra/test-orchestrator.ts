import { orchestrate } from "./lib/agents/orchestrator";
import { connectDB } from "./lib/db/mongodb";

async function main() {
  await connectDB();
  console.log("Connected to DB");
  
  const results = await orchestrate({ startupName: "Test", idea: "An AI tutor" }, (event) => {
    console.log(event);
  });
  
  console.log("Final Results", results);
  process.exit(0);
}

main().catch(console.error);
