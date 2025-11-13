import mongoose from "mongoose";

const LeaseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "OwnerUser",
      required: true,
    },
    tenant: {
      type: mongoose.Types.ObjectId,
      ref: "TenantUser",
      required: true,
    },
    realEstate: {
      type: mongoose.Types.ObjectId,
      ref: "RealEstate",
      required: true,
    },
    startDate: {
      type: String,
      required: [true, "Please provide a start date"],
    },

    endDate: {
      type: String,
      required: [true, "Please provide an end date"],
    },

    rentAmount: {
      type: Number,
      required: [true, "Please provide a rent amount"],
    },
    paymentPlan: {
      type: String,
      enum: {
        values: [
          "Monthly",
          "Every 2 Months",
          "Every 3 Months",
          "Every 6 Months",
          "Every 12 Months",
        ],
        message: "{VALUE} is not supported",
      },
      required: [true, "Please provide a plan"],
      default: "Monthly",
    },

    tenantInformation: {

      fullName: {
        type: String,
        required: false,
      },
      phoneNumber: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      emergencyContact: {
        name: {
          type: String,
          required: false,
        },
        phoneNumber: {
          type: String,
          required: false,
        },
        relationship: {
          type: String,
          required: false,
        },
      },
      photoId: {
        type: String,
        required: false,
      },
      proofOfIncome: {
        type: [String],
        required: false,
        default: [],
      },
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Pending", "Pending-updated", "Unsigned", "Terminated-pending", "Terminated-approved", "Terminated"],
        message: "{VALUE} is not supported",
      },
      default: "Pending",
    },
    digitalSignature: {
      type: String,
      required: false,
    },
    leaseSignTime: {
      type: Date,
      required: false,
    }
  },
  { timestamps: true }
);

// Method to check if tenant information is complete
LeaseSchema.methods.isTenantInfoComplete = function () {
  const tenantInfo = this.tenantInformation || {};
  const emergencyContact = tenantInfo.emergencyContact || {};

  return !!(
    tenantInfo.fullName &&
    tenantInfo.phoneNumber &&
    tenantInfo.email &&
    tenantInfo.photoId &&
    emergencyContact.name &&
    emergencyContact.phoneNumber &&
    tenantInfo.proofOfIncome
  )
}

export default mongoose.model("Lease", LeaseSchema);
