import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogOverlay = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Overlay
            ref={ref}
            className={`fixed inset-0 z-50 bg-black/50 ${className}`}
            {...props}
        />
    )
)
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

export const AlertDialogContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                ref={ref}
                className={`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}
                {...props}
            />
        </AlertDialogPortal>
    )
)
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

export const AlertDialogHeader = ({ className, ...props }) => (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

export const AlertDialogFooter = ({ className, ...props }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

export const AlertDialogTitle = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Title
            ref={ref}
            className={`text-lg font-semibold ${className}`}
            {...props}
        />
    )
)
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

export const AlertDialogDescription = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Description
            ref={ref}
            className={`text-sm text-gray-500 ${className}`}
            {...props}
        />
    )
)
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

export const AlertDialogAction = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Action
            ref={ref}
            className={`inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${className}`}
            {...props}
        />
    )
)
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

export const AlertDialogCancel = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Cancel
            ref={ref}
            className={`inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-100 ${className}`}
            {...props}
        />
    )
)
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
