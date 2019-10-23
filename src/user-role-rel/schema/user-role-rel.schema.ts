import * as mongoose from 'mongoose';

export const UserRoleRel = new mongoose.Schema(
  {
    userId: String,
    roleId: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  },
);
