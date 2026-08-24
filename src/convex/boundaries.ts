import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByCamera = query({
  args: { cameraId: v.id("cameras") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boundaries")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.cameraId))
      .collect();
  },
});

export const add = mutation({
  args: {
    cameraId: v.id("cameras"),
    name: v.string(),
    type: v.union(v.literal("zone"), v.literal("tripwire")),
    vertices: v.array(v.object({ x: v.number(), y: v.number() })),
    direction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("boundaries", {
      cameraId: args.cameraId,
      name: args.name,
      type: args.type,
      vertices: args.vertices,
      direction: args.direction,
    });
  },
});

export const remove = mutation({
  args: { boundaryId: v.id("boundaries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.boundaryId);
  },
});
