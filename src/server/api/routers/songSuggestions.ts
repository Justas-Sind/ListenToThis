import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const configPrompt = "Provide an array of strings of music bands. Your answer must only be an array and no extra words. The array should contain 5 strings of music bands based on this description: "

export const songRouter = createTRPCRouter({
  getMusic: privateProcedure
    .input(z.object({ content: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.userId;
      
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: configPrompt + input.content,
          },
        ],
        max_tokens: 1000,
      });

      return response.data.choices[0]?.message;
    }),
});
