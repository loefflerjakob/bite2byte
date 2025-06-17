import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';

import { NextRequest } from 'next/server';
 
/* Models
llama-3.3-70b-versatile
deepseek-r1-distill-llama-70b
*/
const serviceAdapter = new GroqAdapter({ model: "llama-3.3-70b-versatile" });
const runtime = new CopilotRuntime();
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit/groq',
  });
 
  return handleRequest(req);
};