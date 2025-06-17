import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';

import { NextRequest } from 'next/server';
 
/* Models
gemini-2.0-flash
gemini-2.5-flash-preview-05-20
*/
const serviceAdapter = new GoogleGenerativeAIAdapter({ model: "gemini-2.0-flash" });
const runtime = new CopilotRuntime();
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit/gemini',
  });
 
  return handleRequest(req);
};