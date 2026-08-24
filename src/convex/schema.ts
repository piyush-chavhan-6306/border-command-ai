import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    cameras: defineTable({
      name: v.string(),
      source: v.string(),
      sourceType: v.union(v.literal("upload"), v.literal("webcam"), v.literal("rtsp")),
      targetFilters: v.array(v.string()),
      isLive: v.boolean(),
      fps: v.number(),
    }),

    boundaries: defineTable({
      cameraId: v.id("cameras"),
      name: v.string(),
      type: v.union(v.literal("zone"), v.literal("tripwire")),
      vertices: v.array(v.object({ x: v.number(), y: v.number() })),
      direction: v.optional(v.string()),
    }).index("by_camera", ["cameraId"]),

    alerts: defineTable({
      cameraId: v.id("cameras"),
      boundaryId: v.optional(v.id("boundaries")),
      severity: v.union(v.literal("critical"), v.literal("warning")),
      targetLabel: v.string(),
      targetTrackId: v.number(),
      targetType: v.string(),
      reason: v.string(),
      timestamp: v.number(),
      status: v.union(v.literal("new"), v.literal("acknowledged")),
      confidence: v.number(),
      speed: v.number(),
      heading: v.string(),
      snapshotDataUrl: v.optional(v.string()),
      summary: v.string(),
    }).index("by_camera", ["cameraId"])
      .index("by_status", ["status"])
      .index("by_timestamp", ["timestamp"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
