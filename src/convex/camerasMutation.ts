import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    name: v.string(),
    source: v.string(),
    sourceType: v.union(v.literal("upload"), v.literal("webcam"), v.literal("rtsp")),
    targetFilters: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const cameraId = await ctx.db.insert("cameras", {
      name: args.name,
      source: args.source,
      sourceType: args.sourceType,
      targetFilters: args.targetFilters,
      isLive: true,
      fps: 30,
    });
    return cameraId;
  },
});

export const updateFilters = mutation({
  args: {
    cameraId: v.id("cameras"),
    targetFilters: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.cameraId, { targetFilters: args.targetFilters });
  },
});

export const remove = mutation({
  args: { cameraId: v.id("cameras") },
  handler: async (ctx, args) => {
    // Remove associated boundaries and alerts
    const boundaries = await ctx.db
      .query("boundaries")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.cameraId))
      .collect();
    for (const b of boundaries) {
      await ctx.db.delete(b._id);
    }
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.cameraId))
      .collect();
    for (const a of alerts) {
      await ctx.db.delete(a._id);
    }
    await ctx.db.delete(args.cameraId);
  },
});
