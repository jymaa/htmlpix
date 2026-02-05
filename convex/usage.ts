import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { DataModel, Doc } from "./_generated/dataModel";

export const usageAggregate = new TableAggregate<{
  Key: [string, number, number];
  DataModel: DataModel;
  TableName: "usageMonthly";
}>(components.aggregate, {
  sortKey: (doc: Doc<"usageMonthly">) => [doc.userId, doc.year, doc.month],
  sumValue: () => 1,
});
