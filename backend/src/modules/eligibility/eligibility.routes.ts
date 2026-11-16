import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { checkAgeEligibility } from '../../utils/age.js';

export const eligibilityRouter = Router();

const checkSchema = z.object({
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Tug‘ilgan sana noto‘g‘ri formatda.',
  }),
});

/**
 * Public route to verify age eligibility before registration or mode selection.
 */
eligibilityRouter.post('/check', (req: Request, res: Response) => {
  const result = checkSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.errors[0].message,
    });
  }

  const dob = new Date(result.data.dateOfBirth);
  const eligibility = checkAgeEligibility(dob);

  return res.json({
    success: true,
    data: eligibility,
  });
});
