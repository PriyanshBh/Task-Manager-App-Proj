import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const taskInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in_progress", "done"])
});

export const taskRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          query: z.string().optional(),
          status: z.enum(["todo", "in_progress", "done", "all"]).optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.userId,
        ...(input?.query
          ? {
              OR: [
                { title: { contains: input.query } },
                { description: { contains: input.query } }
              ]
            }
          : {}),
        ...(input?.status && input.status !== "all" ? { status: input.status } : {})
      };

      return ctx.prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" }
      });
    }),
  create: protectedProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
    return ctx.prisma.task.create({
      data: {
        ...input,
        userId: ctx.userId
      }
    });
  }),
  update: protectedProcedure
    .input(
      taskInput.extend({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const task = await ctx.prisma.task.findFirst({
        where: { id, userId: ctx.userId }
      });

      if (!task) {
        throw new Error("Task not found");
      }

      return ctx.prisma.task.update({
        where: { id },
        data
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.deleteMany({
        where: { id: input.id, userId: ctx.userId }
      });

      return { success: true };
    })
});
