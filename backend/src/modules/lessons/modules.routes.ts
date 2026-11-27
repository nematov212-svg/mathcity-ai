import { Router, Response } from 'express';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const modulesRouter = Router();

/**
 * GET /api/modules
 * Returns curriculum modules, optionally filtered by grade.
 * e.g. GET /api/modules?grade=1
 */
modulesRouter.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
  const userId = req.user?.id;
  const modules = repository.getModules(grade, userId);

  return res.json({
    success: true,
    data: modules,
  });
});

/**
 * GET /api/modules/:id
 * Returns a specific module with summary.
 */
modulesRouter.get('/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const moduleId = req.params.id;
  const userId = req.user?.id;
  const modules = repository.getModules(undefined, userId);
  const found = modules.find((m) => m.id === moduleId);

  if (!found) {
    return res.status(404).json({ success: false, error: 'Modul topilmadi.' });
  }

  return res.json({
    success: true,
    data: found,
  });
});

/**
 * GET /api/modules/:id/lessons
 * Returns the sequential lessons of this module.
 */
modulesRouter.get('/:id/lessons', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const moduleId = String(req.params.id);
  const userId = req.user?.id;
  const lessons = repository.getModuleLessons(moduleId, userId);

  return res.json({
    success: true,
    data: lessons,
  });
});
