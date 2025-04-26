"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Form validation schemas
const transactionSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});

export async function createTransaction(formData: FormData) {
  try {
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const date = new Date(formData.get("date") as string);

    // Validate form data
    const validatedData = transactionSchema.parse({
      amount,
      description,
      date,
    });

    await prisma.transactions.create({
      data: validatedData,
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function updateTransaction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const date = new Date(formData.get("date") as string);

    // Validate form data
    const validatedData = transactionSchema.parse({
      amount,
      description,
      date,
    });

    await prisma.transactions.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}

export async function deleteTransaction(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.transactions.delete({
    where: { id },
  });
  revalidatePath("/");
} 