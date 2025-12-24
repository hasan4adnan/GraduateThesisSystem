import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errno?: number;
  sqlMessage?: string;
}

export const errorHandler = (
  err: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MySQL foreign key constraint errors
  // Check both direct properties and nested error properties
  const errorCode = err.code || (err as any)?.code;
  const errorErrno = err.errno || (err as any)?.errno;
  const sqlMessage = err.sqlMessage || (err as any)?.sqlMessage || '';

  if (errorCode === 'ER_ROW_IS_REFERENCED_2' || errorErrno === 1451) {
    statusCode = 400;
    
    // Determine what entity is being deleted from the request path
    // Check both originalUrl (full path) and path (relative to mount point)
    const fullPath = req.originalUrl || req.url || req.path || '';
    const isDeletingUniversity = fullPath.includes('/universities/') && req.method === 'DELETE';
    const isDeletingInstitute = fullPath.includes('/institutes/') && req.method === 'DELETE';
    const isDeletingPerson = fullPath.includes('/people/') && req.method === 'DELETE';
    const isDeletingSubjectTopic = fullPath.includes('/subject-topics/') && req.method === 'DELETE';
    const isDeletingThesis = fullPath.includes('/theses/') && req.method === 'DELETE';

    // Parse the SQL message to find which table is referencing (child table)
    // Format: foreign key constraint fails (`gts`.`child_table`, CONSTRAINT ... REFERENCES `parent_table`)
    let referencingTable = '';
    if (sqlMessage.includes('`gts`.`')) {
      const match = sqlMessage.match(/`gts`\.`(\w+)`/);
      if (match) {
        referencingTable = match[1].toLowerCase();
      }
    }

    // Provide specific error messages based on what's being deleted
    if (isDeletingUniversity) {
      if (referencingTable === 'institute') {
        message = 'Cannot delete this university because it has associated institutes. Please delete or reassign the institutes first.';
      } else {
        message = 'Cannot delete this university because it is referenced by other records. Please remove the references first.';
      }
    } else if (isDeletingInstitute) {
      if (referencingTable === 'thesis') {
        message = 'Cannot delete this institute because it has associated theses. Please delete or reassign the theses first.';
      } else {
        message = 'Cannot delete this institute because it is referenced by other records. Please remove the references first.';
      }
    } else if (isDeletingPerson) {
      if (referencingTable === 'thesis' || sqlMessage.includes('author_id') || sqlMessage.includes('supervisor')) {
        message = 'Cannot delete this person because they are associated with theses (as author or supervisor). Please remove these associations first.';
      } else {
        message = 'Cannot delete this person because they are referenced by other records. Please remove the references first.';
      }
    } else if (isDeletingSubjectTopic) {
      if (referencingTable === 'thesis' || sqlMessage.includes('thesis_subjecttopic')) {
        message = 'Cannot delete this subject topic because it is associated with theses. Please remove these associations first.';
      } else {
        message = 'Cannot delete this subject topic because it is referenced by other records. Please remove the references first.';
      }
    } else if (isDeletingThesis) {
      message = 'Cannot delete this thesis because it is referenced by other records. Please remove the references first.';
    } else {
      // Fallback: try to determine from SQL message
      if (sqlMessage.includes('institute') && !isDeletingInstitute) {
        message = 'Cannot delete this item because it has associated institutes. Please delete or reassign the institutes first.';
      } else if (sqlMessage.includes('thesis')) {
        message = 'Cannot delete this item because it has associated theses. Please delete or reassign the theses first.';
      } else if (sqlMessage.includes('person')) {
        message = 'Cannot delete this item because it has associated people. Please remove the references first.';
      } else {
        message = 'Cannot delete this item because it is referenced by other records. Please remove the references first.';
      }
    }
  }

  // Handle other MySQL constraint errors
  if (errorCode === 'ER_NO_REFERENCED_ROW_2' || errorErrno === 1452) {
    statusCode = 400;
    message = 'Cannot create or update this record because the referenced item does not exist.';
  }

  console.error('Error:', err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};



