"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type DeleteButtonProps =
    ButtonHTMLAttributes<HTMLButtonElement> & {
        children?: ReactNode;
        iconOnly?: boolean;
        variant?: VariantProps<typeof buttonVariants>["variant"];
        onPendingChange?: (pending: boolean) => void;
    };

export function DeleteButton({
    children = "Delete",
    iconOnly = false,
    variant = "ghost",
    onPendingChange,
    ...props
}: DeleteButtonProps) {
    const { pending } = useFormStatus();

    useEffect(() => {
        onPendingChange?.(pending);
    }, [pending, onPendingChange]);

    return (
        <Button
            type="submit"
            variant={variant}
            size={iconOnly ? "icon" : "sm"}
            disabled={pending}
            {...props}
        >
            {pending ? (
                <>
                    <LoadingSpinner
                        className={
                            iconOnly
                                ? "size-4"
                                : "mr-2 size-4"
                        }
                    />

                    {!iconOnly && "Deleting..."}
                </>
            ) : (
                children
            )}
        </Button>
    );
}