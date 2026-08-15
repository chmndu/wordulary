"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createCollection(
    formData: FormData
) {
    const name = formData.get("name");

    if (typeof name !== "string" || !name.trim()) {
        return {
            error: "Collection name is required.",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "User not authenticated.",
        };
    }

    const { error } = await supabase
        .from("collections")
        .insert({
            user_id: user.id,
            name: name.trim(),
        });

    if (error) {
        console.error(error);

        return {
            error:
                error.code === "23505"
                    ? "Collection already exists."
                    : "Failed to create collection.",
        };
    }

    revalidatePath("/dashboard/collections");

    return {
        success: true,
    };
}

export async function deleteCollection(
    formData: FormData
) {
    const id = formData.get("id");

    if (typeof id !== "string") {
        return;
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return;
    }

    const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error(error);
        return;
    }

    revalidatePath("/dashboard/collections");
    
    redirect("/dashboard/collections");
}