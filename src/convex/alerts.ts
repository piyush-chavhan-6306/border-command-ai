import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByCamera = query({
  args: { cameraId: v.id("cameras") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("alerts")
      .withIndex("by_camera", (q) => q.eq("cameraId", args.cameraId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("alerts").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    cameraId: v.id("cameras"),
    boundaryId: v.optional(v.id("boundaries")),
    severity: v.union(v.literal("critical"), v.literal("warning")),
    targetLabel: v.string(),
    targetTrackId: v.number(),
    targetType: v.string(),
    reason: v.string(),
    timestamp: v.number(),
    confidence: v.number(),
    speed: v.number(),
    heading: v.string(),
    snapshotDataUrl: v.optional(v.string()),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      status: "new",
    });
  },
});

export const acknowledge = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, { status: "acknowledged" });
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").collect();
    for (const alert of alerts) {
      await ctx.db.delete(alert._id);
    }
    return alerts.length;
  },
});
