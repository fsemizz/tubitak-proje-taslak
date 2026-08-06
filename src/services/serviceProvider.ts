import type { IGameContentService, IResultsService, ITeacherService } from './types';
import { LocalGameContentService } from './localGameContentService';
import { LocalResultsService } from './localResultsService';
import { LocalTeacherService } from './localTeacherService';

export const gameContentService: IGameContentService = new LocalGameContentService();
export const resultsService: IResultsService = new LocalResultsService();
export const teacherService: ITeacherService = new LocalTeacherService();
