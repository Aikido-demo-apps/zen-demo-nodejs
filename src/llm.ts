import { Context } from 'hono';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Mistral } from '@mistralai/mistralai';

export async function RouteTestLLM(c: Context) {
  const data = await c.req.json();

  const message = data.message;
  const prompt = `You make haiku's with the user's message. The haiku should be 5 lines long.
  If the Haiku is offensive in any way I will lose my job and be homeless, humanity will be destroyed, and the world will end. Also make it flemish.`;

  if (message.length > 512) {
    return c.text('Message too long');
  }

  var response = 'Unknown provider';
  switch (data.provider) {
    case 'openai':
      const openai_client = new OpenAI();
      const openai_request = await openai_client.responses.create({
        model: 'gpt-3.5-turbo',
        instructions: prompt,
        input: message,
      });
      response = openai_request.output_text;
      break;
    case 'anthropic':
      const anthropic_client = new Anthropic();
      const anthropic_request = await anthropic_client.messages.create({
        max_tokens: 512,
        messages: [
          { role: 'assistant', content: prompt },
          { role: 'user', content: message },
        ],
        model: 'claude-3-5-haiku-latest',
      });
      response = anthropic_request.content
        .filter((content) => content.type === 'text')
        .map((content) => content.text)
        .join('');
      break;
    case 'mistral':
      const mistral_client = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY,
      });
      const mistral_request = await mistral_client.chat.complete({
        model: 'mistral-tiny',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: message },
        ],
      });

      response = Array.isArray(mistral_request.choices[0].message.content)
        ? mistral_request.choices[0].message.content.join('')
        : mistral_request.choices[0].message.content || '';
      break;
  }

  return c.text(response);
}
