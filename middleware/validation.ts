//zod validation middleware
import { z, ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: any, res: any, next: any) => {
    console.log("Validating request body:", JSON.stringify(req.body, null, 2));
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      console.log("Validation failed!");
      console.log(
        "Validation errors:",
        JSON.stringify(parsed.error.errors, null, 2)
      );

      // Format validation errors nicely
      const formattedErrors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        received:
          err.code === "invalid_type"
            ? typeof (err as any).received
            : undefined,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: formattedErrors,
      });
    }

    next();
  };