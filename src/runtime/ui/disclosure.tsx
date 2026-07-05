import * as React from "react";
import { cn } from "./utils.js";

export function DisclosureGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

export function DisclosureItem({
  className,
  ...props
}: React.ComponentProps<"details">) {
  return <details className={cn(className)} {...props} />;
}

export function DisclosureTrigger({
  className,
  ...props
}: React.ComponentProps<"summary">) {
  return <summary className={cn(className)} {...props} />;
}

export function DisclosureContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}
