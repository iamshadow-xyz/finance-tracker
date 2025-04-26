
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { MonthlyExpensesChart } from "./components/MonthlyExpensesChart";
import { Header } from "./components/Header";
import prisma from "@/lib/prisma";
import { deleteTransaction, updateTransaction } from "./action";

export default async function Home() {
  const transactions = await prisma.transactions.findMany({
    orderBy: { date: "desc" },
  });

  // Calculate monthly expenses for the last 6 months
  const lastSixMonths = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyExpenses = lastSixMonths.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(month, "MMM yyyy"),
      total,
    };
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Header />
      
      <div className="grid grid-cols-1 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart data={monthlyExpenses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(transaction.date, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                          </DialogHeader>
                          <form
                            action={updateTransaction}
                            className="space-y-4"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={transaction.id}
                            />
                            <div className="space-y-2">
                              <Label htmlFor={`edit-amount-${transaction.id}`}>
                                Amount
                              </Label>
                              <Input
                                id={`edit-amount-${transaction.id}`}
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                defaultValue={transaction.amount}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`edit-description-${transaction.id}`}
                              >
                                Description
                              </Label>
                              <Input
                                id={`edit-description-${transaction.id}`}
                                name="description"
                                type="text"
                                required
                                minLength={1}
                                defaultValue={transaction.description}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-date-${transaction.id}`}>
                                Date
                              </Label>
                              <Input
                                id={`edit-date-${transaction.id}`}
                                name="date"
                                type="date"
                                required
                                defaultValue={format(
                                  transaction.date,
                                  "yyyy-MM-dd"
                                )}
                              />
                            </div>
                            <Button type="submit">Save Changes</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <form action={deleteTransaction}>
                        <input type="hidden" name="id" value={transaction.id} />
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
