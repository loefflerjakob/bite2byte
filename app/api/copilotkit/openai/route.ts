import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';



/* Models
gpt-4o
gpt-3.5-turbo
o4-mini
*/

const serviceAdapter = new OpenAIAdapter({
  model: 'gpt-4o',
});

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit/openai',
  });

  return handleRequest(req);
};
