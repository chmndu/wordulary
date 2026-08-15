"use client";

import { useRef, useState } from "react";
import { DeleteButton } from "@/components/ui/delete-button";
import { Trash2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";

type ConfirmDeleteButtonProps = {
    label?: string;
    itemName: string;
    itemType?: string;
    description?: string;
    confirmLabel?: string;
    iconOnly?: boolean;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    onDeletingChange?: (deleting: boolean) => void;
};

export function ConfirmDeleteButton({
    label = "Delete",
    itemName,
    itemType = "Item",
    description,
    confirmLabel,
    iconOnly = false,
    variant = "ghost",
    onDeletingChange,
}: ConfirmDeleteButtonProps) {
    const [open, setOpen] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);

    return (
        <>
            <DeleteButton
                iconOnly={iconOnly}
                variant={variant}
                aria-label={`Delete ${itemName}`}
                onPendingChange={onDeletingChange}
                onClick={(event) => {
                    event.preventDefault();

                    formRef.current = event.currentTarget.form;

                    setOpen(true);
                }}
            >
                {iconOnly ? (
                    <Trash2 className="size-4" />
                ) : (
                    label
                )}
            </DeleteButton>

            <ConfirmDeleteDialog
                open={open}
                onOpenChange={setOpen}
                itemName={itemName}
                itemType={itemType}
                description={description}
                confirmLabel={confirmLabel}
                onConfirm={() => {
                    setOpen(false);
                    formRef.current?.requestSubmit();
                }}
            />
        </>
    );
}